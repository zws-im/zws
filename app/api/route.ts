import { Http } from '@jonahsnider/util';
import { validateBody } from 'next-api-utils';
import { NextResponse } from 'next/server';
import { authorizationService } from './_lib/authorization/authorization.service';
import { Action } from './_lib/authorization/enums/action.enum';
import { exceptionRouteWrapper } from './_lib/exception-route-wrapper';
import { LongUrlSchema } from './_lib/urls/dtos/long-url.dto';
import { ShortenedUrlSchema } from './_lib/urls/dtos/shortened-url.dto';
import { ShortenedUrlData } from './_lib/urls/interfaces/shortened-url.interface';
import { urlsService } from './_lib/urls/urls.service';

function shortIdToShortenedUrlDto(url: ShortenedUrlData): ShortenedUrlSchema {
	return {
		short: url.short,
		url: url.url ? decodeURI(url.url.toString()) : undefined,
	};
}

export const POST = exceptionRouteWrapper.wrapRoute<ShortenedUrlSchema>(async (request) => {
	authorizationService.assertPermissions(request, Action.ShortenUrl);

	const longUrl = await validateBody(request, LongUrlSchema);

	const url = await urlsService.shortenUrl(longUrl.url);

	return NextResponse.json(shortIdToShortenedUrlDto(url), {
		status: Http.Status.Created,
	});
});
