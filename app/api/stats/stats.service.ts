import { ApproximateCountKind } from '@prisma/client';
import { prisma } from '../prisma';
import { Stats } from './interfaces/stats.interface';

// TODO: Previously, on application boot this value would be calculated using savePreciseInstanceStats()
// That behavior no longer exists. Instead, we should create a migration to add a createdAt date to the approximateCounts table
// Set some expiry date (7 days or something) and then recalculate the stats if the date is older than the expiry date

export class StatsService {
	async getInstanceStats(): Promise<Stats> {
		const [urls, visits] = await prisma.$transaction([
			prisma.approximateCounts.findUnique({
				where: { kind: ApproximateCountKind.SHORTENED_URLS },
				select: { count: true },
			}),
			prisma.approximateCounts.findUnique({
				where: { kind: ApproximateCountKind.VISITS },
				select: { count: true },
			}),
		]);

		if (urls?.count && visits?.count) {
			return { urls: urls.count, visits: visits.count };
		}

		return this.savePreciseInstanceStats();
	}

	/**
	 * Performs an expensive query to get the statistics for this instance.
	 *
	 * @returns The precise instant stats
	 */
	private async savePreciseInstanceStats(): Promise<Stats> {
		const [urls, visits] = await prisma.$transaction([
			prisma.shortenedUrl.count({ where: { blocked: false } }),
			prisma.visit.count({ where: { shortenedUrl: { blocked: false } } }),
		]);

		await prisma.$transaction([
			prisma.approximateCounts.upsert({
				where: { kind: ApproximateCountKind.SHORTENED_URLS },
				update: { count: urls },
				create: { kind: ApproximateCountKind.SHORTENED_URLS, count: urls },
			}),
			prisma.approximateCounts.upsert({
				where: { kind: ApproximateCountKind.VISITS },
				update: { count: visits },
				create: { kind: ApproximateCountKind.VISITS, count: visits },
			}),
		]);

		return { urls, visits };
	}
}

export const statsService = new StatsService();
