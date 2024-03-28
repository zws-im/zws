import { Module } from '@nestjs/common';
import { BlockedHostnamesModule } from '../blocked-hostnames/blocked-hostnames.module';
import { UrlStatsController } from './url-stats.controller';
import { UrlStatsRouter } from './url-stats.router';
import { UrlStatsService } from './url-stats.service';

@Module({
	imports: [BlockedHostnamesModule],
	providers: [UrlStatsService, UrlStatsRouter],
	exports: [UrlStatsService, UrlStatsRouter],
	controllers: [UrlStatsController],
})
export class UrlStatsModule {}
