import { Inject, Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import type { Db } from '../db/interfaces/db.interface';
import { DB_PROVIDER } from '../db/providers';
import type { InstanceStats } from './dtos/stats.dto';

@Injectable()
export class StatsService {
	constructor(@Inject(DB_PROVIDER) private readonly db: Db) {}

	async getInstanceStats(): Promise<InstanceStats> {
		const [[urls], [visits]] = await Promise.all([
			this.db
				.select({
					estimate: sql`reltuples`,
				})
				.from(sql`pg_class`)
				.where(eq(sql`relname`, 'urls')),
			this.db
				.select({
					estimate: sql`reltuples`,
				})
				.from(sql`pg_class`)
				.where(eq(sql`relname`, 'visits')),
		]);

		return { urls: (urls?.estimate as number | undefined) ?? 0, visits: (visits?.estimate as number | undefined) ?? 0 };
	}
}
