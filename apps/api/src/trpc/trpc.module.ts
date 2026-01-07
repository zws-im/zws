import { Module } from '@nestjs/common';
import { StatsModule } from '../stats/stats.module.js';
import { UrlStatsModule } from '../url-stats/url-stats.module.js';
import { UrlsModule } from '../urls/urls.module.js';
import { AppRouter } from './app.router.js';
import { TrpcService } from './trpc.service.js';

@Module({
	imports: [UrlsModule, StatsModule, UrlStatsModule],
	providers: [TrpcService, AppRouter],
})
export class TrpcModule {}
