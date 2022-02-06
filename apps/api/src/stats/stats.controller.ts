import {Controller, Get, Query} from '@nestjs/common';
import {ApiExtraModels, ApiOkResponse, ApiOperation, ApiTags, getSchemaPath} from '@nestjs/swagger';
import {AppConfig} from '../app-config/app.config';
import {FormattedStatsDto} from './dto/formatted-stats.dto';
import {RawStatsDto} from './dto/raw-stats.dto';
import {StatsQueryDto} from './dto/stats-query.dto';
import {StatsService} from './stats.service';

@ApiTags('stats')
@Controller('stats')
@ApiExtraModels(FormattedStatsDto, RawStatsDto)
export class StatsController {
	private readonly version: string;

	constructor(private readonly service: StatsService, config: AppConfig) {
		this.version = config.version;
	}

	@Get()
	@ApiOperation({operationId: 'total-stats', summary: 'Total statistics', description: 'Total usage statistics for this instance.'})
	@ApiOkResponse({
		schema: {
			oneOf: [{$ref: getSchemaPath(FormattedStatsDto)}, {$ref: getSchemaPath(RawStatsDto)}],
		},
	})
	async stats(@Query() query: StatsQueryDto): Promise<FormattedStatsDto | RawStatsDto> {
		const {format: shouldFormat} = query;

		const stats = await this.service.instanceStats();

		if (shouldFormat) {
			return new FormattedStatsDto(this.version, stats);
		}

		return new RawStatsDto(this.version, stats);
	}
}
