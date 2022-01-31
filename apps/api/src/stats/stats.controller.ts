import {Controller, Get, Query} from '@nestjs/common';
import {ApiExtraModels, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, getSchemaPath} from '@nestjs/swagger';
import {AppConfigService} from '../app.config';
import {FormattedStatsDto} from './dto/formatted-stats.dto';
import {RawStatsDto} from './dto/raw-stats.dto';
import {StatsQueryDto} from './dto/stats-query.dto';
import {StatsService} from './stats.service';

@ApiTags('stats')
@Controller('stats')
@ApiExtraModels(FormattedStatsDto, RawStatsDto)
export class StatsController {
	private readonly version: string;

	constructor(private readonly service: StatsService, config: AppConfigService) {
		this.version = config.version;
	}

	async stats(query: {format: true}): Promise<FormattedStatsDto>;
	async stats(query: {format: false}): Promise<RawStatsDto>;
	// eslint-disable-next-line @typescript-eslint/member-ordering
	@Get()
	@ApiOperation({operationId: 'total-stats', summary: 'Total statistics', description: 'Total usage statistics for this instance.'})
	@ApiQuery({
		name: 'format',
		required: false,
		type: 'boolean',
		schema: {default: false},
		description: 'Whether to format the numbers in the response as strings.',
	})
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
