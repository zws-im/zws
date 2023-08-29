import { Http } from '@jonahsnider/util';
import { NextRequest, NextResponse } from 'next/server';
import { authorizationService } from './_lib/authorization/authorization.service';
import { Action } from './_lib/authorization/enums/action.enum';
import { ExceptionSchema } from './_lib/exceptions/dtos/exception.dto';
import { AttemptedShortenBlockedHostnameException } from './_lib/urls/attempted-shorten-blocked-hostname.exception';
import { LongUrlSchema } from './_lib/urls/dtos/long-url-dto';
import { ShortenedUrlSchema } from './_lib/urls/dtos/shortened-url.dto';
import { ShortenedUrlData } from './_lib/urls/interfaces/shortened-url.interface';
import { UniqueShortIdTimeoutException } from './_lib/urls/unique-short-id-timeout.exception';
import { urlsService } from './_lib/urls/urls.service';
import { validateBody } from './_lib/util/validate-request';

function shortIdToShortenedUrlDto(url: ShortenedUrlData): ShortenedUrlSchema {
	return {
		short: url.short,
		url: url.url ? decodeURI(url.url.toString()) : undefined,
	};
}

export async function POST(request: NextRequest): Promise<NextResponse<ShortenedUrlSchema | ExceptionSchema>> {
	const authError = authorizationService.assertPermissions(request, Action.ShortenUrl);
	if (authError) {
		return authError;
	}

	const longUrl = await validateBody(request, LongUrlSchema);

	let url: ShortenedUrlData;
	try {
		url = await urlsService.shortenUrl(longUrl.url);
	} catch (error) {
		if (error instanceof UniqueShortIdTimeoutException || error instanceof AttemptedShortenBlockedHostnameException) {
			return error.toResponse();
		}

		throw error;
	}

	return NextResponse.json(shortIdToShortenedUrlDto(url), {
		status: Http.Status.Created,
	});
}
