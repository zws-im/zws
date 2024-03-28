import { sample } from '@jonahsnider/util';
import { Inject, Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseError } from 'pg';
import { BlockedHostnamesService } from '../blocked-hostnames/blocked-hostnames.service';
import { ConfigService } from '../config/config.service';
import { Schema } from '../db/index';
import type { Db } from '../db/interfaces/db.interface';
import { DB_PROVIDER } from '../db/providers';
import type { Short } from './dtos/short.dto';
import type { ShortenedUrlData } from './interfaces/shortened-url.interface';
import type { Base64 } from './interfaces/urls.interface';
import type { VisitUrlData } from './interfaces/visit-url-data.interface';

@Injectable()
export class UrlsService {
	/** Maximum number of attempts to generate a unique ID. */
	private static readonly MAX_SHORT_ID_GENERATION_ATTEMPTS = 10;

	static toBase64(value: string): Base64 {
		return Buffer.from(value).toString('base64') as Base64;
	}

	constructor(
		@Inject(BlockedHostnamesService) private readonly blockedHostnamesService: BlockedHostnamesService,
		@Inject(ConfigService) private readonly configService: ConfigService,
		@Inject(DB_PROVIDER) private readonly db: Db,
	) {}

	/**
	 * Retrieve a shortened URL.
	 *
	 * @param id - The ID of the shortened URL to visit
	 *
	 * @returns The long URL and whether it was blocked
	 */
	async retrieveUrl(id: Short): Promise<VisitUrlData | undefined> {
		const encodedId = UrlsService.toBase64(id);

		const [shortenedUrl] = await this.db
			.select({
				url: Schema.urls.url,
				blocked: Schema.urls.blocked,
			})
			.from(Schema.urls)
			.where(eq(Schema.urls.shortBase64, encodedId));

		if (!shortenedUrl) {
			return undefined;
		}

		if (await this.blockedHostnamesService.isUrlBlocked(shortenedUrl)) {
			if (!shortenedUrl.blocked) {
				// The URL hostname is blocked, but the entry in the database isn't
				// So, we should update the entry in the DB to mark it as blocked
				await this.db.update(Schema.urls).set({ blocked: true }).where(eq(Schema.urls.shortBase64, encodedId));
			}

			return {
				longUrl: undefined,
				blocked: true,
			};
		}

		return {
			longUrl: shortenedUrl.url,
			blocked: false,
		};
	}

	/**
	 * Shorten a long URL.
	 *
	 * @param url - The long URL to shorten
	 *
	 * @returns The ID of the shortened URL
	 */
	async shortenUrl(url: string): Promise<ShortenedUrlData> {
		if (await this.blockedHostnamesService.isHostnameBlocked(new URL(url))) {
			throw new UnprocessableEntityException('That URL hostname is blocked');
		}

		let attempts = 0;
		let created: typeof Schema.urls.$inferSelect | undefined;
		let id: Short;

		do {
			if (attempts++ > UrlsService.MAX_SHORT_ID_GENERATION_ATTEMPTS) {
				throw new InternalServerErrorException(
					'Unable to generate a unique short ID within the max number of attempts',
				);
			}

			id = this.generateShortId();
			const shortBase64 = UrlsService.toBase64(id);

			try {
				[created] = await this.db
					.insert(Schema.urls)
					.values({
						url,
						shortBase64,
						createdAt: new Date(),
					})
					.returning();
			} catch (error) {
				if (error instanceof DatabaseError && error.code === '23505') {
					// Ignore the expected potential duplicate ID errors
				} else {
					throw error;
				}
			}
		} while (!created);

		return {
			short: id,
			url: new URL(id, this.configService.websiteUrl),
		};
	}

	/**
	 * Generate a short ID.
	 * Not guaranteed to be unique.
	 *
	 * @returns A short ID
	 */
	private generateShortId(): Short {
		let shortId = '';

		for (let i = 0; i < this.configService.shortenedLength; i++) {
			shortId += sample(this.configService.characters);
		}

		return shortId as Short;
	}
}
