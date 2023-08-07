import { PrismaClient } from '@prisma/client';
import { prisma } from '../../prisma';
import { Short } from '../interfaces/urls.interface';
import { UrlsService } from '../../urls.service';
import { UrlStats } from './dtos/url-stats.dto';

export class UrlStatsService {
	constructor(private readonly prisma: PrismaClient) {}

	/**
	 * Retrieve usage statistics for a shortened URL.
	 *
	 * @param id - The ID of the shortened URL
	 *
	 * @returns Shortened URL information and statistics, or `undefined` if it couldn't be found
	 */
	async statsForUrl(id: Short): Promise<UrlStats | undefined> {
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
				visits: visits.map((visit) => visit.timestamp),
				url: shortenedUrl.url,
			};
		}

		return undefined;
	}
}

export const urlStatsService = new UrlStatsService(prisma);
