import { Module } from '@nestjs/common';
import { BlockedHostnamesModule } from '../blocked-hostnames/blocked-hostnames.module';
import { UrlStatsModule } from '../url-stats/url-stats.module';
import { UrlsController } from './urls.controller';
import { UrlsRouter } from './urls.router';
import { UrlsService } from './urls.service';

@Module({
	imports: [BlockedHostnamesModule, UrlStatsModule],
	controllers: [UrlsController],
	providers: [UrlsService, UrlsRouter],
	exports: [UrlsService, UrlsRouter],
})
export class UrlsModule {}
