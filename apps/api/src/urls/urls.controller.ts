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
import {Short, UrlsService} from './urls.service';

@ApiTags('urls')
@Controller()
export class UrlsController {
	constructor(private readonly service: UrlsService, private readonly config: UrlsConfigService) {}

	@Post()
	// @UseGuards(AuthGuard)
	@ApiSecurity('bearer')
	@ApiOperation({operationId: 'urls-shorten', summary: 'Shorten URL', description: 'Shorten a URL.'})
	@ApiResponse({status: Http.Status.Created, type: ShortenedUrlDto})
	// @ApiResponse({status: Http.Status.Unauthorized, type: ApiKeyError})
	@ApiResponse({status: Http.Status.UnprocessableEntity, type: AttemptedShortenBlockedHostname})
	@ApiResponse({status: Http.Status.ServiceUnavailable, type: UniqueShortIdTimeout})
	async shorten(@Body() longUrlDto: LongUrlDto, @Res() response: Response): Promise<ShortenedUrlDto> {
		const {url} = longUrlDto;

		const longUrlHostname = new URL(url).hostname;

		if (this.service.isHostnameBlocked(longUrlHostname)) {
			throw new AttemptedShortenBlockedHostname();
		}

		const id = await this.service.shortenUrl(url);

		response.status(Http.Status.Created);

		return this.shortIdToShortenedUrlDto(id);
	}

	private shortIdToShortenedUrlDto(short: Short): ShortenedUrlDto {
		const result: ShortenedUrlDto = {
			short,
		};

		if (this.config.baseUrlForShortenedUrls) {
			result.url = decodeURI(new URL(short, this.config.baseUrlForShortenedUrls).toString());
		}

		return result;
	}

	@Get(':short')
	async visit() {}
}
