import { sample } from '@jonahsnider/util';
import { ApproximateCountKind, Prisma, PrismaClient, ShortenedUrl } from '@prisma/client';
import { BlockedHostnamesService, blockedHostnamesService } from '../blocked-hostnames/blocked-hostnames.service';
import { ConfigService, configService } from '../config/config.service';
import { ShortenedUrlModel } from '../mongodb/models/shortened-url.model';
import { prisma } from '../prisma';
import { AttemptedShortenBlockedHostnameException } from './exceptions/attempted-shorten-blocked-hostname.exception';
import { UniqueShortIdTimeoutException } from './exceptions/unique-short-id-timeout.exception';
import { ShortenedUrlData } from './interfaces/shortened-url.interface';
import { Base64, Short } from './interfaces/urls.interface';
import { VisitUrlData } from './interfaces/visit-url-data.interface';

export class UrlsService {
	/** Maximum number of attempts to generate a unique ID. */
	private static readonly MAX_SHORT_ID_GENERATION_ATTEMPTS = 10;

	static encode(value: string): Base64 {
		return Buffer.from(value).toString('base64') as Base64;
	}

	constructor(
		private readonly prisma: PrismaClient,
		private readonly blockedHostnamesService: BlockedHostnamesService,
		private readonly configService: ConfigService,
	) {}

	/**
	 * Retrieve a shortened URL.
	 *
	 * @param id - The ID of the shortened URL to visit
	 *
	 * @returns The long URL and whether it was blocked
	 */
	async retrieveUrl(id: Short): Promise<VisitUrlData | undefined> {
		const encodedId = UrlsService.encode(id);

		const shortenedUrl = await ShortenedUrlModel.findOne(
			{ shortBase64: encodedId },
			{ projection: { url: 1, blocked: 1 } },
		);

		if (!shortenedUrl) {
			return undefined;
		}

		if (await this.blockedHostnamesService.isUrlBlocked(shortenedUrl)) {
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
	// biome-ignore lint/nursery/noExcessiveComplexity: Doesn't really make sense to split this logic out, it would be messier
	async shortenUrl(url: string): Promise<ShortenedUrlData> {
		const hostname = new URL(url).hostname;

		if (await this.blockedHostnamesService.isHostnameBlocked(hostname)) {
			throw new AttemptedShortenBlockedHostnameException();
		}

		let attempts = 0;
		let created: ShortenedUrl | undefined;
		let id: Short;

		do {
			if (attempts++ > UrlsService.MAX_SHORT_ID_GENERATION_ATTEMPTS) {
				throw new UniqueShortIdTimeoutException(UrlsService.MAX_SHORT_ID_GENERATION_ATTEMPTS);
			}

			id = this.generateShortId();
			const shortBase64 = UrlsService.encode(id);

			try {
				// eslint-disable-next-line no-await-in-loop
				[created] = await this.prisma.$transaction([
					this.prisma.shortenedUrl.create({ data: { url, shortBase64 } }),
					this.prisma.approximateCounts.update({
						where: { kind: ApproximateCountKind.SHORTENED_URLS },
						data: { count: { increment: 1 } },
					}),
				]);
			} catch (error) {
				// https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
				if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
					// Ignore the expected potential duplicate ID errors
				} else {
					throw error;
				}
			}
		} while (!created);

		await ShortenedUrlModel.insertOne({
			blocked: created.blocked,
			createdAt: created.createdAt,
			shortBase64: created.shortBase64,
			url: created.url,
		});

		return {
			short: id,
			url: this.configService.shortenedBaseUrl ? new URL(id, configService.shortenedBaseUrl) : undefined,
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

export const urlsService = new UrlsService(prisma, blockedHostnamesService, configService);
