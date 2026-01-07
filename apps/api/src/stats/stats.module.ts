import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller.js';
import { StatsRouter } from './stats.router.js';
import { StatsService } from './stats.service.js';

@Module({
	controllers: [StatsController],
	providers: [StatsService, StatsRouter],
	exports: [StatsService, StatsRouter],
})
export class StatsModule {}
