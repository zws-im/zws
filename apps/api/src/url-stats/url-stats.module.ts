import { Module } from '@nestjs/common';
import { BlockedUrlsModule } from '../blocked-urls/blocked-urls.module.js';
import { UrlStatsController } from './url-stats.controller.js';
import { UrlStatsRouter } from './url-stats.router.js';
import { UrlStatsService } from './url-stats.service.js';

@Module({
	imports: [BlockedUrlsModule],
	providers: [UrlStatsService, UrlStatsRouter],
	exports: [UrlStatsService, UrlStatsRouter],
	controllers: [UrlStatsController],
})
export class UrlStatsModule {}
