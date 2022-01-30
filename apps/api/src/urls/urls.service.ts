import {multiReplace, sample} from '@jonahsnider/util';
import {Injectable, Logger} from '@nestjs/common';
import type {ShortenedUrl} from '@prisma/client';
import {ApproximateCountKind} from '@prisma/client';
import Sentry from '@sentry/node';
import {Buffer} from 'node:buffer';
import type {Opaque} from 'type-fest';
import {PrismaService} from '../prisma/prisma.service';
import type {ShortenedUrlDto} from './dto/shortened-url.dto.js';
import {UniqueShortIdTimeout} from './errors/unique-short-id-timeout.error.dto';
import {UrlsConfigService} from './urls-config.service';

/** A short ID. */
export type Short = Opaque<string, 'Short'>;

/** A base64 encoded string. */
type Base64 = Opaque<string, 'Base64'>;

interface Stats {
	url: string;
	visits: Date[];
}

interface VisitUrlData {
	longUrl: string;
	blocked: boolean;
}

/** Maximum number of attempts to generate a unique ID. */
const MAX_SHORT_ID_GENERATION_ATTEMPTS = 10;

/** A regular expression for a domain name. */
const DOMAIN_NAME_REG_EXP = /(?:.+\.)?(.+\..+)$/i;

@Injectable()
export class UrlsService {
	private static encode(value: string): Base64 {
		return Buffer.from(value).toString('base64') as Base64;
	}

	private readonly logger = new Logger(UrlsService.name);

	constructor(private readonly config: UrlsConfigService, private readonly db: PrismaService) {}

	normalizeShortId(id: Short): Short {
		if (this.config.shortCharRewrites) {
			return multiReplace(id, this.config.shortCharRewrites) as Short;
		}

		return id;
	}

	/**
	 * Visit a shortened URL.
	 *
	 * @param id - The ID of the shortened URL to visit
	 * @param track - If the visit should be tracked
	 *
	 * @returns The long URL and if it was blocked
	 */
	async visitUrl(id: Short, track: boolean): Promise<VisitUrlData | null> {
		const encodedId = UrlsService.encode(id);

		const shortenedUrl = await this.db.shortenedUrl.findUnique({where: {shortBase64: encodedId}, select: {url: true, blocked: true}});

		if (shortenedUrl === null) {
			return null;
		}

		if (track && !shortenedUrl.blocked) {
			// Only track URLs if they aren't blocked
			// This is because we know that a blocked URL won't be sent to clients if they are visiting it

			this.db
				.$transaction([
					this.db.visit.create({data: {shortenedUrl: {connect: {shortBase64: encodedId}}}}),
					this.db.approximateCounts.update({where: {kind: ApproximateCountKind.VISITS}, data: {count: {increment: 1}}}),
				])
				.catch(error => {
					Sentry.captureException(error);
					this.logger.error('failed to create visit', error);
				});
		}

		return {longUrl: shortenedUrl.url, blocked: shortenedUrl.blocked};
	}

	/**
	 * Retrieve usage statistics for a shortened URL.
	 *
	 * @param id - The ID of the shortened URL
	 *
	 * @returns Shortened URL information and statistics, or `null` if it couldn't be found
	 */
	async statsForUrl(id: Short): Promise<null | Stats> {
		const encodedId = UrlsService.encode(id);

		const [visits, shortenedUrl] = await this.db.$transaction([
			this.db.visit.findMany({where: {shortenedUrlId: encodedId}, select: {timestamp: true}, orderBy: {timestamp: 'asc'}}),
			this.db.shortenedUrl.findUnique({where: {shortBase64: encodedId}, select: {url: true}}),
		]);

		if (!shortenedUrl) {
			return null;
		}

		return {visits: visits.map(visit => visit.timestamp), url: shortenedUrl.url};
	}

	/**
	 * Shorten a long URL.
	 *
	 * @param url - The long URL to shorten
	 *
	 * @returns The ID of the shortened URL
	 */
	async shortenUrl(url: string): Promise<Short> {
		let attempts = 0;
		let created: ShortenedUrl | null = null;
		let id: Short;

		do {
			if (attempts++ > MAX_SHORT_ID_GENERATION_ATTEMPTS) {
				throw new UniqueShortIdTimeout(MAX_SHORT_ID_GENERATION_ATTEMPTS);
			}

			id = this.generateShortId();
			const shortBase64 = UrlsService.encode(id);

			try {
				// eslint-disable-next-line no-await-in-loop
				[created] = await this.db.$transaction([
					this.db.shortenedUrl.create({data: {url, shortBase64}}),
					this.db.approximateCounts.update({where: {kind: ApproximateCountKind.SHORTENED_URLS}, data: {count: {increment: 1}}}),
				]);
			} catch {}
		} while (!created);

		return id;
	}

	isHostnameBlocked(hostname: string): boolean {
		return (
			// Exact match
			this.config.blockedHostnames.has(hostname) ||
			// Domain name match
			this.config.blockedHostnames.has(hostname.replace(DOMAIN_NAME_REG_EXP, '$1'))
		);
	}

	/**
	 * Generate a short ID.
	 * Not guaranteed to be unique.
	 *
	 * @returns A short ID
	 */
	private generateShortId(): Short {
		let shortId = '' as Short;

		// eslint-disable-next-line @typescript-eslint/prefer-for-of
		for (let i = 0; i < this.config.characters.length; i++) {
			// @ts-expect-error String concatenation forces string type
			shortId += sample(this.config.characters) as Short;
		}

		return shortId;
	}
}
