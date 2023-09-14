import { ApproximateCountKind, PrismaClient } from '@prisma/client';
import { prisma } from '../prisma';
import { StatsSchema } from './dtos/stats.dto';
import { ShortenedUrlModel } from '../mongodb/models/shortened-url.model';
import { VisitModel } from '../mongodb/models/visit.model';

export class StatsService {
	constructor(private readonly prisma: PrismaClient) {}

	async getInstanceStats(): Promise<StatsSchema> {
		return this.savePreciseInstanceStats();
	}

	/**
	 * Performs an expensive query to get the statistics for this instance.
	 *
	 * @returns The precise instant stats
	 */
	public async savePreciseInstanceStats(): Promise<StatsSchema> {
		const [urls, visits] = await Promise.all([
			ShortenedUrlModel.collection.estimatedDocumentCount(),
			VisitModel.collection.estimatedDocumentCount(),
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
