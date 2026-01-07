import { Module } from '@nestjs/common';
import { BlockedHostnamesService } from './blocked-hostnames.service.js';

@Module({
	providers: [BlockedHostnamesService],
	exports: [BlockedHostnamesService],
})
export class BlockedHostnamesModule {}
