import {URL} from 'node:url';
import {Http} from '@jonahsnider/util';
import {Body, Controller, Get, Param, Post, Query, Res} from '@nestjs/common';
import {
	ApiCreatedResponse,
	ApiGoneResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiServiceUnavailableResponse,
	ApiTags,
	ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {Response} from 'express';
import {MinimumRoleNeeded} from '../auth/decorators/role.decorator';
import {Role} from '../auth/enums/roles.enum';
import {LongUrlDto} from './dto/long-url.dto';
import {ShortenedUrlDto} from './dto/shortened-url.dto';
import {UrlStatsDto} from './dto/url-stats.dto';
import {VisitUrlQueryDto} from './dto/visit-url-query.dto';
import {AttemptedShortenBlockedHostnameException} from './exceptions/attempted-shorten-blocked-hostname.exception';
import {UniqueShortIdTimeoutException} from './exceptions/unique-short-id-timeout.exception';
import {UrlBlockedException} from './exceptions/url-blocked.exception';
import {UrlNotFoundException} from './exceptions/url-not-found.exception';
import {NormalizeShortIdPipe} from './pipes/normalize-short-id.pipe';
import {UrlsConfigService} from './urls-config.service';
import {Short, UrlsService} from './urls.service';

@ApiTags('urls')
@Controller()
export class UrlsController {
	constructor(private readonly service: UrlsService, private readonly config: UrlsConfigService) {}

	@Post()
	@MinimumRoleNeeded(Role.User)
	@ApiOperation({operationId: 'urls-shorten', summary: 'Shorten URL', description: 'Shorten a URL.'})
	@ApiCreatedResponse({type: ShortenedUrlDto})
	@ApiUnprocessableEntityResponse({type: AttemptedShortenBlockedHostnameException})
	@ApiServiceUnavailableResponse({type: UniqueShortIdTimeoutException})
	async shorten(@Res() response: Response, @Body() longUrlDto: LongUrlDto): Promise<void> {
		const {url} = longUrlDto;

		const longUrlHostname = new URL(url).hostname;

		if (this.service.isHostnameBlocked(longUrlHostname)) {
			throw new AttemptedShortenBlockedHostnameException();
		}

		const id = await this.service.shortenUrl(url);

		response.status(Http.Status.Created).json(this.shortIdToShortenedUrlDto(id));
	}

	@Get(':short')
	@ApiOperation({operationId: 'urls-visit', summary: 'Visit or retrieve shortened URL', description: 'Visit or retrieve a shortened URL.'})
	@ApiParam({name: 'short', description: 'The ID of the shortened URL.'})
	@ApiOkResponse({type: LongUrlDto})
	@ApiResponse({status: Http.Status.PermanentRedirect})
	@ApiNotFoundResponse({type: UrlNotFoundException})
	@ApiGoneResponse({type: UrlBlockedException, description: "This URL has been blocked and can't be accessed"})
	async retrieveOrVisitUrl(@Res() response: Response, @Param('short', NormalizeShortIdPipe) short: Short, @Query() query: VisitUrlQueryDto): Promise<void> {
		const {visit: shouldVisit} = query;

		const url = await this.service.retrieveUrl(short);

		if (!url) {
			throw new UrlNotFoundException();
		}

		if (shouldVisit) {
			const longUrlHostname = new URL(url.longUrl).hostname;

			if (url.blocked || this.service.isHostnameBlocked(longUrlHostname)) {
				// Don't allow users to visit blocked URLs
				throw new UrlBlockedException();
			}

			response.redirect(Http.Status.PermanentRedirect, url.longUrl);
			response.end();

			await this.service.trackUrlVisit(short);
		} else {
			response.json(new LongUrlDto(url.longUrl));
		}
	}

	@Get('/:short/stats')
	@ApiOperation({operationId: 'urls-stats', summary: 'URL stats', description: 'Retrieve usage statistics for a shortened URL.'})
	@ApiParam({name: 'short', description: 'The ID of the shortened URL.'})
	@ApiOkResponse({type: UrlStatsDto})
	@ApiNotFoundResponse({type: UrlNotFoundException})
	async stats(@Param('short', NormalizeShortIdPipe) short: Short): Promise<UrlStatsDto> {
		const stats = await this.service.statsForUrl(short);

		if (!stats) {
			throw new UrlNotFoundException();
		}

		return new UrlStatsDto(stats);
	}

	private shortIdToShortenedUrlDto(short: Short): ShortenedUrlDto {
		if (this.config.baseUrlForShortenedUrls) {
			return new ShortenedUrlDto(short, new URL(short, this.config.baseUrlForShortenedUrls).toString());
		}

		return new ShortenedUrlDto(short);
	}
}
