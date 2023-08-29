import { ApproximateCountKind, PrismaClient } from '@prisma/client';
import { prisma } from '../prisma';
import { Short } from '../urls/interfaces/urls.interface';
import { UrlsService } from '../urls/urls.service';
import { UrlStatsSchema } from './dtos/url-stats.dto';

export class UrlStatsService {
	constructor(private readonly prisma: PrismaClient) {}

	/**
	 * Retrieve usage statistics for a shortened URL.
	 *
	 * @param id - The ID of the shortened URL
	 *
	 * @returns Shortened URL information and statistics, or `undefined` if it couldn't be found
	 */
	async statsForUrl(id: Short): Promise<UrlStatsSchema | undefined> {
		const encodedId = UrlsService.encode(id);

		const [visits, shortenedUrl] = await this.prisma.$transaction([
			this.prisma.visit.findMany({
				where: { shortenedUrlId: encodedId },
				select: { timestamp: true },
				orderBy: { timestamp: 'asc' },
			}),
			this.prisma.shortenedUrl.findUnique({
				where: { shortBase64: encodedId },
				select: { url: true },
			}),
		]);

		if (shortenedUrl) {
			return {
				visits: visits.map((visit) => visit.timestamp.toISOString()),
				url: shortenedUrl.url,
			};
		}

		return undefined;
	}

	/**
	 * Tracks a URL visit.
	 * @param id - The ID of the shortened URL
	 */
	async trackUrlVisit(id: Short): Promise<void> {
		const encodedId = UrlsService.encode(id);

		await this.prisma.$transaction([
			this.prisma.visit.create({
				data: { shortenedUrl: { connect: { shortBase64: encodedId } } },
			}),
			this.prisma.approximateCounts.update({
				where: { kind: ApproximateCountKind.VISITS },
				data: { count: { increment: 1 } },
			}),
		]);
	}
}

export const urlStatsService = new UrlStatsService(prisma);
