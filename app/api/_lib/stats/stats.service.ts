import { ApproximateCountKind, PrismaClient } from '@prisma/client';
import { prisma } from '../prisma';
import { StatsSchema } from './dtos/stats.dto';

export class StatsService {
	constructor(private readonly prisma: PrismaClient) {}

	async getInstanceStats(): Promise<StatsSchema> {
		const [urls, visits] = await this.prisma.$transaction([
			this.prisma.approximateCounts.findUnique({
				where: { kind: ApproximateCountKind.SHORTENED_URLS },
				select: { count: true },
			}),
			this.prisma.approximateCounts.findUnique({
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
	public async savePreciseInstanceStats(): Promise<StatsSchema> {
		const [urls, visits] = await this.prisma.$transaction([
			this.prisma.shortenedUrl.count({ where: { blocked: false } }),
			this.prisma.visit.count({ where: { shortenedUrl: { blocked: false } } }),
		]);

		await this.prisma.$transaction([
			this.prisma.approximateCounts.upsert({
				where: { kind: ApproximateCountKind.SHORTENED_URLS },
				update: { count: urls },
				create: { kind: ApproximateCountKind.SHORTENED_URLS, count: urls },
			}),
			this.prisma.approximateCounts.upsert({
				where: { kind: ApproximateCountKind.VISITS },
				update: { count: visits },
				create: { kind: ApproximateCountKind.VISITS, count: visits },
			}),
		]);

		return { urls, visits };
	}
}

export const statsService = new StatsService(prisma);
