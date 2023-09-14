import { ApproximateCountKind, PrismaClient } from '@prisma/client';
import { BlockedHostnamesService, blockedHostnamesService } from '../blocked-hostnames/blocked-hostnames.service';
import { prisma } from '../prisma';
import { UrlBlockedException } from '../urls/exceptions/url-blocked.exception';
import { Short } from '../urls/interfaces/urls.interface';
import { UrlsService } from '../urls/urls.service';
import { UrlStatsSchema } from './dtos/url-stats.dto';
import { VisitModel } from '../mongodb/models/visit.model';
import { ShortenedUrlModel } from '../mongodb/models/shortened-url.model';

class UrlStatsService {
	constructor(
		private readonly prisma: PrismaClient,
		private readonly blockedHostnamesService: BlockedHostnamesService,
	) {}

	/**
	 * Retrieve usage statistics for a shortened URL.
	 *
	 * @param id - The ID of the shortened URL
	 *
	 * @returns Shortened URL information and statistics, or `undefined` if it couldn't be found
	 */
	async statsForUrl(id: Short): Promise<UrlStatsSchema | undefined> {
		const encodedId = UrlsService.encode(id);

		const shortenedUrl = await ShortenedUrlModel.findOne({ shortBase64: encodedId }, { projection: { url: 1, blocked: 1 } });

		if (!shortenedUrl) {
			return undefined;
		}

		if (await this.blockedHostnamesService.isUrlBlocked(shortenedUrl)) {
			throw new UrlBlockedException();
		}

		const visits = await VisitModel.find({ shortenedUrlBase64: encodedId }, { projection: { timestamp: 1 } });

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

		const [visit] = await this.prisma.$transaction([
			this.prisma.visit.create({
				data: { shortenedUrl: { connect: { shortBase64: encodedId } } },
			}),
			this.prisma.approximateCounts.update({
				where: { kind: ApproximateCountKind.VISITS },
				data: { count: { increment: 1 } },
			}),
		]);

		await VisitModel.insertOne({
			id: visit.id,
			timestamp: visit.timestamp,
			shortenedUrlBase64: visit.shortenedUrlId,
		});
	}
}

export const urlStatsService = new UrlStatsService(prisma, blockedHostnamesService);
