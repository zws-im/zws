import { Inject, Injectable } from '@nestjs/common';
import { publicProcedure, router } from '../trpc/trpc.js';
import { InstanceStats } from './dtos/stats.dto.js';
import { StatsService } from './stats.service.js';

@Injectable()
export class StatsRouter {
	constructor(@Inject(StatsService) private readonly statsService: StatsService) {}
	createRouter() {
		return router({
			getInstanceStats: publicProcedure.output(InstanceStats).query(() => this.statsService.getInstanceStats()),
		});
	}
}
