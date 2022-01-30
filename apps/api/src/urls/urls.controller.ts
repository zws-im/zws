import {Http} from '@jonahsnider/util';
import {Body, Controller, Get, Post, Res, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiSecurity, ApiTags} from '@nestjs/swagger';
import {Response} from 'express';
import {URL} from 'node:url';
import {AuthGuard} from '../auth/auth.guard';
import {LongUrlDto} from './dto/long-url.dto';
import {ShortenedUrlDto} from './dto/shortened-url.dto';
import {AttemptedShortenBlockedHostname} from './errors/attempted-shorten-blocked-hostname.error';
import {UniqueShortIdTimeout} from './errors/unique-short-id-timeout.error.dto';
import {UrlsConfigService} from './urls-config.service';
import {UrlsService} from './urls.service';

/** A regular expression for a domain name. */
const DOMAIN_NAME_REG_EXP = /(?:.+\.)?(.+\..+)$/i;

@ApiTags('urls')
@Controller()
export class UrlsController {
	constructor(private readonly service: UrlsService, private readonly config: UrlsConfigService) {}

	@Post()
	@UseGuards(AuthGuard)
	@ApiSecurity('bearer')
	@ApiOperation({operationId: 'urls-shorten', summary: 'Shorten URL', description: 'Shorten a URL.'})
	@ApiResponse({status: Http.Status.Created, type: ShortenedUrlDto})
	// @ApiResponse({status: Http.Status.Unauthorized, type: ApiKeyError})
	@ApiResponse({status: Http.Status.UnprocessableEntity, type: AttemptedShortenBlockedHostname})
	@ApiResponse({status: Http.Status.ServiceUnavailable, type: UniqueShortIdTimeout})
	async shorten(@Body() longUrlDto: LongUrlDto, @Res() response: Response): Promise<ShortenedUrlDto> {
		const {url} = longUrlDto;

		const longUrlHostname = new URL(url).hostname;

		if (
			// Exact match
			this.config.blockedHostnames.has(longUrlHostname) ||
			// Domain name match
			this.config.blockedHostnames.has(longUrlHostname.replace(DOMAIN_NAME_REG_EXP, '$1'))
		) {
			throw new AttemptedShortenBlockedHostname();
		}

		const id = await this.service.shortenUrl(url);

		response.status(Http.Status.Created);

		const responseBody: ShortenedUrlDto = {short: id};

		if (this.config.baseUrlForShortenedUrls) {
			responseBody.url = decodeURI(new URL(id, this.config.baseUrlForShortenedUrls).toString());
		}

		return responseBody;
	}

	@Get(':short')
	async visit() {}
}
