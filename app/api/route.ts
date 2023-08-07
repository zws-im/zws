import { Http } from '@jonahsnider/util';
import { NextRequest, NextResponse } from 'next/server';
import { configService } from './_lib/config/config.service';
import { ExceptionSchema } from './_lib/dtos/exception.dto';
import { LongUrlSchema } from './_lib/urls/dtos/long-url-dto';
import { ShortenedUrlSchema } from './_lib/urls/dtos/shortened-url.dto';
import { Short } from './_lib/urls/interfaces/urls.interface';
import { urlsService } from './_lib/urls/urls.service';
import { validateBody } from './_lib/util/validate-request';

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

	const idOrException = await urlsService.shortenUrl(longUrl.url);

	if (typeof idOrException === 'object') {
		return idOrException.toResponse();
	}

	return NextResponse.json(shortIdToShortenedUrlDto(idOrException), {
		status: Http.Status.Created,
	});
}
