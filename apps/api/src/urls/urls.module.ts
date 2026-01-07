import { Module } from '@nestjs/common';
import { BlockedUrlsModule } from '../blocked-urls/blocked-urls.module.js';
import { UrlStatsModule } from '../url-stats/url-stats.module.js';
import { UrlsController } from './urls.controller.js';
import { UrlsRouter } from './urls.router.js';
import { UrlsService } from './urls.service.js';

@Module({
	imports: [BlockedUrlsModule, UrlStatsModule],
	controllers: [UrlsController],
	providers: [UrlsService, UrlsRouter],
	exports: [UrlsService, UrlsRouter],
})
export class UrlsModule {}
