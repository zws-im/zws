import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OpenapiTag } from '../openapi/openapi-tag.enum';
import { InstanceStatsDto } from './dtos/stats.dto';
import { StatsService } from './stats.service';

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
