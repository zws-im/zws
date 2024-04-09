import { Module } from '@nestjs/common';
import { SafeBrowsingService } from './safe-browsing.service';

@Module({
	providers: [SafeBrowsingService],
	exports: [SafeBrowsingService],
})
export class SafeBrowsingModule {}
