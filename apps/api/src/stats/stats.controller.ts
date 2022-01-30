import {Controller, Get, Query} from '@nestjs/common';
import {ApiExtraModels, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, getSchemaPath} from '@nestjs/swagger';
import {AppConfigService} from '../app.config';
import {FormattedStatsEntity} from './entities/formatted-stats.entity';
import {RawStatsEntity} from './entities/raw-stats.entity';
import {StatsService} from './stats.service';

@ApiTags('stats')
@Controller('stats')
@ApiExtraModels(FormattedStatsEntity, RawStatsEntity)
export class StatsController {
	private readonly version: string;

	constructor(private readonly service: StatsService, config: AppConfigService) {
		this.version = config.version;
	}

	async stats(format: true): Promise<FormattedStatsEntity>;
	async stats(format: false): Promise<RawStatsEntity>;
	// eslint-disable-next-line @typescript-eslint/member-ordering
	@Get()
	@ApiOperation({operationId: 'total-stats', summary: 'Total statistics', description: 'Total usage statistics for this instance.'})
	@ApiQuery({name: 'format', required: false, schema: {default: false}, description: 'Whether to format the numbers in the response as strings.'})
	@ApiOkResponse({
		schema: {
			oneOf: [{$ref: getSchemaPath(FormattedStatsEntity)}, {$ref: getSchemaPath(RawStatsEntity)}],
		},
	})
	async stats(@Query('format') format = false): Promise<FormattedStatsEntity | RawStatsEntity> {
		const stats = await this.service.instanceStats();

		if (format) {
			return new FormattedStatsEntity(this.version, stats);
		}

		return new RawStatsEntity(this.version, stats);
	}
}
