import { Module } from '@nestjs/common';
import { BlockedUrlsModule } from '../blocked-urls/blocked-urls.module';
import { UrlStatsModule } from '../url-stats/url-stats.module';
import { UrlsController } from './urls.controller';
import { UrlsRouter } from './urls.router';
import { UrlsService } from './urls.service';

@Module({
	imports: [BlockedUrlsModule, UrlStatsModule],
	controllers: [UrlsController],
	providers: [UrlsService, UrlsRouter],
	exports: [UrlsService, UrlsRouter],
})
export class UrlsModule {}
