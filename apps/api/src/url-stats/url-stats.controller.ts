import { Controller, Get, Inject, NotFoundException, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OpenapiTag } from '../openapi/openapi-tag.enum.js';
import { Short } from '../urls/dtos/short.dto.js';
import { UrlStatsDto } from './dtos/url-stats.dto.js';
import { UrlStatsService } from './url-stats.service.js';

@Controller('/')
@ApiTags(OpenapiTag.ShortenedUrls)
export class UrlStatsController {
	constructor(@Inject(UrlStatsService) private readonly urlStatsService: UrlStatsService) {}

	@Get('/:short/stats')
	@ApiOkResponse({ type: UrlStatsDto })
	async getShortUrlStats(@Param('short') rawShort: string): Promise<UrlStatsDto> {
		const short = Short.parse(rawShort);

		const stats = await this.urlStatsService.statsForUrl(short);

		if (!stats) {
			throw new NotFoundException("That shortened URL couldn't be found, no stats");
		}

		return stats;
	}
}
