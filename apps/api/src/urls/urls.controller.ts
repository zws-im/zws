import {URL} from 'node:url';
import {Http} from '@jonahsnider/util';
import {Body, Controller, Get, Param, Post, Query, Res, UseGuards} from '@nestjs/common';
import {
	ApiCreatedResponse,
	ApiGoneResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiSecurity,
	ApiServiceUnavailableResponse,
	ApiTags,
	ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {Response} from 'express';
import {AuthGuard} from '../auth/auth.guard';
import {LongUrlDto} from './dto/long-url.dto';
import {ShortenedUrlDto} from './dto/shortened-url.dto';
import {AttemptedShortenBlockedHostnameException} from './errors/attempted-shorten-blocked-hostname.error';
import {UniqueShortIdTimeoutException} from './errors/unique-short-id-timeout.error';
import {UrlBlockedException} from './errors/url-blocked.error';
import {UrlNotFoundException} from './errors/url-not-found.error';
import {UrlsConfigService} from './urls-config.service';
import {Short, UrlsService} from './urls.service';
import {UrlStatsDto} from './dto/url-stats.dto';
import {VisitUrlQueryDto} from './dto/visit-url-query.dto';

@ApiTags('urls')
@Controller()
export class UrlsController {
	constructor(private readonly service: UrlsService, private readonly config: UrlsConfigService) {}

	@Post()
	@UseGuards(AuthGuard)
	@ApiOperation({operationId: 'urls-shorten', summary: 'Shorten URL', description: 'Shorten a URL.'})
	@ApiSecurity('bearer')
	@ApiCreatedResponse({type: ShortenedUrlDto})
	// @ApiResponse({status: Http.Status.Unauthorized, type: ApiKeyError})
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
	@ApiQuery({name: 'visit', required: false, schema: {default: true}, description: 'Whether to redirect to the URL or return the long URL.'})
	@ApiOkResponse({type: LongUrlDto})
	@ApiResponse({status: Http.Status.PermanentRedirect})
	@ApiNotFoundResponse({type: UrlNotFoundException})
	@ApiGoneResponse({type: UrlBlockedException, description: "This URL has been blocked and can't be accessed"})
	async retrieveOrVisitUrl(@Res() response: Response, @Param('short') short: Short, @Query() query: VisitUrlQueryDto): Promise<void> {
		const {visit: shouldVisit} = query;

		const url = await this.service.visitUrl(this.service.normalizeShortId(short), true);

		if (!url) {
			throw new UrlNotFoundException();
		}

		if (shouldVisit) {
			if (url.blocked) {
				// Don't allow users to visit blocked URLs
				throw new UrlBlockedException();
			}

			console.log('mashallah the the redirect is happening');
			// If you don't encode `url` the node http library may crash with TypeError [ERR_INVALID_CHAR]: Invalid character in header content ["location"]
			response.redirect(Http.Status.PermanentRedirect, encodeURI(url.longUrl));
		} else {
			response.json(new LongUrlDto(url.longUrl));
		}
	}

	@Get('/:short/stats')
	@ApiOperation({operationId: 'urls-stats', summary: 'URL stats', description: 'Retrieve usage statistics for a shortened URL.'})
	@ApiParam({name: 'short', description: 'The ID of the shortened URL.'})
	@ApiOkResponse({type: UrlStatsDto})
	@ApiNotFoundResponse({type: UrlNotFoundException})
	async stats(@Param('short') short: Short): Promise<UrlStatsDto> {
		const stats = await this.service.statsForUrl(this.service.normalizeShortId(short));

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
