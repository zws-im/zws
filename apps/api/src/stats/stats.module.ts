import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsRouter } from './stats.router';
import { StatsService } from './stats.service';

@Module({
	controllers: [StatsController],
	providers: [StatsService, StatsRouter],
	exports: [StatsService, StatsRouter],
})
export class StatsModule {}
