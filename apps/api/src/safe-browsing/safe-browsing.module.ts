import { Module } from '@nestjs/common';
import { SafeBrowsingService } from './safe-browsing.service.js';

@Module({
	providers: [SafeBrowsingService],
	exports: [SafeBrowsingService],
})
export class SafeBrowsingModule {}
