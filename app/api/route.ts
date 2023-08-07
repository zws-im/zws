import { NextRequest, NextResponse } from 'next/server';
import { ExceptionSchema } from './dtos/exception.dto';
import { ShortenedUrlSchema } from './dtos/shortened-url.dto';
import { validateBody } from './util/validate-request';
import { LongUrlSchema } from './[short]/dtos/long-url-dto';
import { urlsService } from './urls.service';
import { Http } from '@jonahsnider/util';
import { Short } from './[short]/interfaces/urls.interface';
import { configService } from './config/config.service';
import { AttemptedShortenBlockedHostnameException } from './exceptions/attempted-shorten-blocked-hostname.exception';
import { UniqueShortIdTimeoutException } from './exceptions/unique-short-id-timeout.exception';

function shortIdToShortenedUrlDto(short: Short): ShortenedUrlSchema {
	if (configService.shortenedBaseUrl) {
		return {
			short,
			url: new URL(short, configService.shortenedBaseUrl).toString(),
		};
	}

	return { short };
}

export async function POST(
	request: NextRequest,
): Promise<NextResponse<ShortenedUrlSchema | ExceptionSchema>> {
	const longUrl = await validateBody(request, LongUrlSchema);

	let id: Short;
	try {
		id = await urlsService.shortenUrl(longUrl.url);
	} catch (error) {
		if (
			error instanceof AttemptedShortenBlockedHostnameException ||
			error instanceof UniqueShortIdTimeoutException
		) {
			return error.toResponse();
		} else {
			throw error;
		}
	}

	return NextResponse.json(shortIdToShortenedUrlDto(id), {
		status: Http.Status.Created,
	});
}
