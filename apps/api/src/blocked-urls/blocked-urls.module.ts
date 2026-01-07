import { Module } from '@nestjs/common';
import { BlockedHostnamesModule } from '../blocked-hostnames/blocked-hostnames.module.js';
import { SafeBrowsingModule } from '../safe-browsing/safe-browsing.module.js';
import { BlockedUrlsService } from './blocked-urls.service.js';

@Module({
	imports: [BlockedHostnamesModule, SafeBrowsingModule],
	providers: [BlockedUrlsService],
	exports: [BlockedUrlsService],
})
export class BlockedUrlsModule {}
