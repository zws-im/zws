import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OpenapiTag } from '../openapi/openapi-tag.enum.js';
import { InstanceStatsDto } from './dtos/stats.dto.js';
import { StatsService } from './stats.service.js';

@Controller('stats')
@ApiTags(OpenapiTag.InstanceStats)
export class StatsController {
	constructor(@Inject(StatsService) private readonly statsService: StatsService) {}

	@Get('/')
	@ApiOkResponse({ type: InstanceStatsDto })
	getInstanceStats(): Promise<InstanceStatsDto> {
		return this.statsService.getInstanceStats();
	}
}
