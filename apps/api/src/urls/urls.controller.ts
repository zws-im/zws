import {
	Body,
	Controller,
	Get,
	GoneException,
	HttpCode,
	HttpStatus,
	Inject,
	NotFoundException,
	Param,
	Post,
	Query,
	Res,
	SerializeOptions,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { OpenapiTag } from '../openapi/openapi-tag.enum.js';
import { UrlStatsService } from '../url-stats/url-stats.service.js';
import { LongUrl } from './dtos/long-url.dto.js';
import { Short } from './dtos/short.dto.js';
import { ShortenedUrl } from './dtos/shortened-url.dto.js';
import { VisitShortUrlQuery } from './dtos/visit-short-url-query.dto.js';
import { UrlsService } from './urls.service.js';

@Controller('/')
@ApiTags(OpenapiTag.ShortenedUrls)
export class UrlsController {
	constructor(
		@Inject(UrlsService) private readonly urlsService: UrlsService,
		@Inject(UrlStatsService) private readonly urlStatsService: UrlStatsService,
	) {}

	@Post('/')
	@HttpCode(HttpStatus.CREATED)
	@ApiCreatedResponse({ standardSchema: ShortenedUrl })
	@SerializeOptions({ schema: ShortenedUrl })
	async shortenUrl(@Body({ schema: LongUrl }) body: LongUrl): Promise<ShortenedUrl> {
		const url = await this.urlsService.shortenUrl(body.url);

		return {
			short: url.short,
			url: url.url.toString(),
		};
	}

	@Get('/:short')
	@ApiOkResponse({ standardSchema: LongUrl })
	@SerializeOptions({ schema: LongUrl })
	async visitShortUrl(
		@Param('short', { schema: Short }) short: Short,
		@Query({ schema: VisitShortUrlQuery }) query: VisitShortUrlQuery,
		@Res({ passthrough: true }) response: Response,
	): Promise<undefined | LongUrl> {
		const url = await this.urlsService.retrieveUrl(short);

		if (!url) {
			throw new NotFoundException("That shortened URL couldn't be found");
		}

		if (url.blocked) {
			throw new GoneException("That URL is blocked and can't be accessed");
		}

		if (query.visit !== false) {
			await this.urlStatsService.trackUrlVisit(short);

			response.redirect(308, url.longUrl.toString());
			return;
		}

		return {
			url: url.longUrl.toString(),
		};
	}
}
