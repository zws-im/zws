import { Controller, Get, Inject, SerializeOptions } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OpenapiTag } from '../openapi/openapi-tag.enum.js';
import { InstanceStats } from './dtos/stats.dto.js';
import { StatsService } from './stats.service.js';

@Controller('stats')
@ApiTags(OpenapiTag.InstanceStats)
export class StatsController {
	constructor(@Inject(StatsService) private readonly statsService: StatsService) {}

	@Get('/')
	@ApiOkResponse({ standardSchema: InstanceStats })
	@SerializeOptions({ schema: InstanceStats })
	getInstanceStats(): Promise<InstanceStats> {
		return this.statsService.getInstanceStats();
	}
}
