import { Inject, Injectable } from '@nestjs/common';
import { publicProcedure, router } from '../trpc/trpc.js';

import { Short } from '../urls/dtos/short.dto.js';
import { UrlStatsSchema } from './dtos/url-stats.dto.js';
import { UrlStatsService } from './url-stats.service.js';

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
