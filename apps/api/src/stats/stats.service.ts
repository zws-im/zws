import type {OnApplicationBootstrap} from '@nestjs/common';
import {Injectable} from '@nestjs/common';
import {ApproximateCountKind} from '@prisma/client';
import {PrismaService} from '../prisma/prisma.service';
import type {Stats} from './interfaces/stats.interface';

@Injectable()
export class StatsService implements OnApplicationBootstrap {
	constructor(private readonly db: PrismaService) {}

	async onApplicationBootstrap(): Promise<void> {
		await this.savePreciseInstanceStats();
	}

	/**
	 * Get statistics for this instance.
	 *
	 * @returns Statistics for this instance
	 */
	async instanceStats(): Promise<Stats> {
		const [urls, visits] = await this.db.$transaction([
			this.db.approximateCounts.findUnique({where: {kind: ApproximateCountKind.SHORTENED_URLS}, select: {count: true}}),
			this.db.approximateCounts.findUnique({where: {kind: ApproximateCountKind.VISITS}, select: {count: true}}),
		]);

		if (urls && visits) {
			return {urls: urls.count, visits: visits.count};
		}

		return this.savePreciseInstanceStats();
	}

	/**
	 * Performs an expensive query to get the statistics for this instance.
	 *
	 * @returns The precise instant stats
	 */
	private async savePreciseInstanceStats(): Promise<Stats> {
		const [urls, visits] = await this.db.$transaction([
			this.db.shortenedUrl.count({where: {blocked: false}}),
			this.db.visit.count({where: {shortenedUrl: {blocked: false}}}),
		]);

		await this.db.$transaction([
			this.db.approximateCounts.upsert({
				where: {kind: ApproximateCountKind.SHORTENED_URLS},
				update: {count: urls},
				create: {kind: ApproximateCountKind.SHORTENED_URLS, count: urls},
			}),
			this.db.approximateCounts.upsert({
				where: {kind: ApproximateCountKind.VISITS},
				update: {count: visits},
				create: {kind: ApproximateCountKind.VISITS, count: visits},
			}),
		]);

		return {urls, visits};
	}
}
