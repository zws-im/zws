import { Module } from '@nestjs/common';
import { BlockedUrlsModule } from '../blocked-urls/blocked-urls.module';
import { UrlStatsController } from './url-stats.controller';
import { UrlStatsRouter } from './url-stats.router';
import { UrlStatsService } from './url-stats.service';

@Module({
	imports: [BlockedUrlsModule],
	providers: [UrlStatsService, UrlStatsRouter],
	exports: [UrlStatsService, UrlStatsRouter],
	controllers: [UrlStatsController],
})
export class UrlStatsModule {}
