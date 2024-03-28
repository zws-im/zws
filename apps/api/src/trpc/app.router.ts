import { Inject, Injectable } from '@nestjs/common';
import { StatsRouter } from '../stats/stats.router';
import { UrlStatsRouter } from '../url-stats/url-stats.router';
import { UrlsRouter } from '../urls/urls.router';
import { router } from './trpc';

@Injectable()
export class AppRouter {
	constructor(
		@Inject(UrlsRouter) private readonly urlsRouter: UrlsRouter,
		@Inject(StatsRouter) private readonly statsRouter: StatsRouter,
		@Inject(UrlStatsRouter) private readonly urlStatsRouter: UrlStatsRouter,
	) {}

	createRouter() {
		return router({
			urls: this.urlsRouter.createRouter(),
			stats: this.statsRouter.createRouter(),
			urlStats: this.urlStatsRouter.createRouter(),
		});
	}
}

export type AppRouterType = ReturnType<AppRouter['createRouter']>;
