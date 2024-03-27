import assert from 'node:assert/strict';
import { type BlockedHostnamesService, blockedHostnamesService } from '../blocked-hostnames/blocked-hostnames.service';
import { ShortenedUrlModel } from '../mongodb/models/shortened-url.model';
import { VisitModel } from '../mongodb/models/visit.model';
import { UrlBlockedException } from '../urls/exceptions/url-blocked.exception';
import type { Short } from '../urls/interfaces/urls.interface';
import { UrlsService } from '../urls/urls.service';
import type { UrlStatsSchema } from './dtos/url-stats.dto';

class UrlStatsService {
	// biome-ignore lint/suspicious/noEmptyBlockStatements: This is a class field
	constructor(private readonly blockedHostnamesService: BlockedHostnamesService) {}

	/**
	 * Retrieve usage statistics for a shortened URL.
	 *
	 * @param id - The ID of the shortened URL
	 *
	 * @returns Shortened URL information and statistics, or `undefined` if it couldn't be found
	 */
	async statsForUrl(id: Short): Promise<UrlStatsSchema | undefined> {
		const encodedId = UrlsService.encode(id);

		const shortenedUrl = await ShortenedUrlModel.findOne(
			{ shortBase64: encodedId },
			{ projection: { url: 1, blocked: 1, _id: 1 } },
		);

		if (!shortenedUrl) {
			return undefined;
		}

		if (await this.blockedHostnamesService.isUrlBlocked(shortenedUrl)) {
			throw new UrlBlockedException();
		}

		const visits = await VisitModel.find({ shortenedUrl: shortenedUrl._id }, { projection: { timestamp: 1 } });

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
		const encodedId = UrlsService.encode(id);

		const shortenedUrl = await ShortenedUrlModel.findOne({ shortBase64: encodedId }, { projection: { _id: 1 } });

		assert(shortenedUrl);

		await VisitModel.insertOne({
			timestamp: new Date(),
			shortenedUrl: shortenedUrl._id,
		});
	}
}

export const urlStatsService = new UrlStatsService(blockedHostnamesService);
