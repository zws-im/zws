import assert from 'node:assert/strict';
import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { BlockedUrlsService } from '../blocked-urls/blocked-urls.service.js';
import { Schema } from '../db/index.js';
import type { Db } from '../db/interfaces/db.interface.js';
import { DB_PROVIDER } from '../db/providers.js';
import type { Short } from '../urls/dtos/short.dto.js';
import { UrlsService } from '../urls/urls.service.js';
import type { UrlStatsSchema } from './dtos/url-stats.dto.js';

@Injectable()
export class UrlStatsService {
	constructor(
		@Inject(BlockedUrlsService)
		private readonly blockedUrlsService: BlockedUrlsService,
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

		const shortenedUrl = await this.db.query.urls.findFirst({
			columns: {
				url: true,
				blocked: true,
				shortBase64: true,
			},
			where: { shortBase64: encodedId },
		});

		if (!shortenedUrl) {
			return undefined;
		}

		if (await this.blockedUrlsService.isUrlBlocked(new URL(shortenedUrl.url))) {
			throw new UnprocessableEntityException('That URL is blocked');
		}

		const visits = await this.db.query.visits.findMany({
			columns: { timestamp: true },
			where: { urlShortBase64: shortenedUrl.shortBase64 },
			orderBy: { timestamp: 'asc' },
		});

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

		const shortenedUrl = await this.db.query.urls.findFirst({
			columns: { shortBase64: true },
			where: { shortBase64: encodedId },
		});

		assert(shortenedUrl, "URL not found, can't track visit");

		await this.db.insert(Schema.visits).values({
			timestamp: new Date(),
			urlShortBase64: shortenedUrl.shortBase64,
		});
	}
}
