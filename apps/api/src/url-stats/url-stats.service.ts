import assert from 'node:assert';
import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { BlockedHostnamesService } from '../blocked-hostnames/blocked-hostnames.service';
import { Schema } from '../db/index';
import type { Db } from '../db/interfaces/db.interface';
import { DB_PROVIDER } from '../db/providers';
import type { Short } from '../urls/dtos/short.dto';
import { UrlsService } from '../urls/urls.service';
import type { UrlStatsSchema } from './dtos/url-stats.dto';

@Injectable()
export class UrlStatsService {
	constructor(
		@Inject(BlockedHostnamesService)
		private readonly blockedHostnamesService: BlockedHostnamesService,
		@Inject(DB_PROVIDER) private readonly db: Db,
	) {}

	/**
	 * Retrieve usage statistics for a shortened URL.
	 *
	 * @param id - The ID of the shortened URL
	 *
	 * @returns Shortened URL information and statistics, or `undefined` if it couldn't be found
	 */
	async statsForUrl(id: Short): Promise<UrlStatsSchema | undefined> {
		const encodedId = UrlsService.toBase64(id);

		const [shortenedUrl] = await this.db
			.select({
				url: Schema.urls.url,
				blocked: Schema.urls.blocked,
				shortBase64: Schema.urls.shortBase64,
			})
			.from(Schema.urls)
			.where(eq(Schema.urls.shortBase64, encodedId));

		if (!shortenedUrl) {
			return undefined;
		}

		if (await this.blockedHostnamesService.isUrlBlocked(shortenedUrl)) {
			throw new UnprocessableEntityException('That URL is blocked');
		}

		const visits = await this.db
			.select({
				timestamp: Schema.visits.timestamp,
			})
			.from(Schema.visits)
			.where(eq(Schema.visits.urlShortBase64, shortenedUrl.shortBase64))
			.orderBy(asc(Schema.visits.timestamp));

		return {
			visits: visits.map((visit) => visit.timestamp.toISOString()),
			url: shortenedUrl.url,
		};
	}

	/**
	 * Tracks a URL visit.
	 * @param id - The ID of the shortened URL
	 */
	async trackUrlVisit(id: Short): Promise<void> {
		const encodedId = UrlsService.toBase64(id);

		// const shortenedUrl = await ShortenedUrlModel.findOne({ shortBase64: encodedId }, { projection: { _id: 1 } });
		const [shortenedUrl] = await this.db
			.select({ shortBase64: Schema.urls.shortBase64 })
			.from(Schema.urls)
			.where(eq(Schema.urls.shortBase64, encodedId));

		assert(shortenedUrl);

		await this.db.insert(Schema.visits).values({
			timestamp: new Date(),
			urlShortBase64: shortenedUrl.shortBase64,
		});
	}
}
