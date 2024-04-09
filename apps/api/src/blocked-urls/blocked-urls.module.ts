import { Module } from '@nestjs/common';
import { BlockedHostnamesModule } from '../blocked-hostnames/blocked-hostnames.module';
import { SafeBrowsingModule } from '../safe-browsing/safe-browsing.module';
import { BlockedUrlsService } from './blocked-urls.service';

@Module({
	imports: [BlockedHostnamesModule, SafeBrowsingModule],
	providers: [BlockedUrlsService],
	exports: [BlockedUrlsService],
})
export class BlockedUrlsModule {}
