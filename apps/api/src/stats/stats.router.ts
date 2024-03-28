import { Inject, Injectable } from '@nestjs/common';
import { publicProcedure, router } from '../trpc/trpc';
import { InstanceStats } from './dtos/stats.dto';
import { StatsService } from './stats.service';

@Injectable()
export class StatsRouter {
	constructor(@Inject(StatsService) private readonly statsService: StatsService) {}
	createRouter() {
		return router({
			getInstanceStats: publicProcedure.output(InstanceStats).query(() => this.statsService.getInstanceStats()),
		});
	}
}
