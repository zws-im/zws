import { Module } from '@nestjs/common';
import { StatsModule } from '../stats/stats.module';
import { UrlStatsModule } from '../url-stats/url-stats.module';
import { UrlsModule } from '../urls/urls.module';
import { AppRouter } from './app.router';
import { TrpcService } from './trpc.service';

@Module({
	imports: [UrlsModule, StatsModule, UrlStatsModule],
	providers: [TrpcService, AppRouter],
})
export class TrpcModule {}
