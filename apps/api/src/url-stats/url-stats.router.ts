import { Inject, Injectable } from '@nestjs/common';
import { publicProcedure, router } from '../trpc/trpc';

import { Short } from '../urls/dtos/short.dto';
import { UrlStatsSchema } from './dtos/url-stats.dto';
import { UrlStatsService } from './url-stats.service';

@Injectable()
export class UrlStatsRouter {
	constructor(@Inject(UrlStatsService) private readonly urlStatsService: UrlStatsService) {}

	createRouter() {
		return router({
			getShortUrlStats: publicProcedure
				.input(Short.optional())
				.output(UrlStatsSchema.nullable())
				.query(async ({ input }) => {
					if (!input) {
						return null;
					}

					const stats = await this.urlStatsService.statsForUrl(input);

					return stats ?? null;
				}),
		});
	}
}
