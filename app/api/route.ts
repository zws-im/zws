import { validateBody } from '@jonahsnider/nextjs-api-utils';
import { Http } from '@jonahsnider/util';
import { NextResponse } from 'next/server';
import { SchemaObject } from 'openapi3-ts/oas31';
import zodToJsonSchema from 'zod-to-json-schema';
import { authorizationService } from './_lib/authorization/authorization.service';
import { Action } from './_lib/authorization/enums/action.enum';
import { exceptionRouteWrapper } from './_lib/exception-route-wrapper';
import { ExceptionSchema } from './_lib/exceptions/dtos/exception.dto';
import { OpenapiTag } from './_lib/openapi/enums/openapi-tag.enum';
import { OpenapiService } from './_lib/openapi/openapi.service';
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

export function openapi(oas: OpenapiService): void {
	oas.addPath({
		method: 'post',
		path: '/',
		tags: [OpenapiTag.ShortenedUrls],
		summary: 'Shorten a URL',
		requestBody: {
			required: true,
			content: {
				'application/json': {
					schema: zodToJsonSchema(LongUrlSchema) as SchemaObject,
				},
			},
		},
		responses: {
			201: {
				description: 'The URL was shortened',
				content: {
					'application/json': {
						schema: ShortenedUrlSchema,
					},
				},
			},
			422: {
				description: "That URL can't be shortened because it's blocked",
				content: {
					'application/json': {
						schema: ExceptionSchema,
					},
				},
			},
			503: {
				description: 'The maximum number of attempts to generate a unique short ID were exceeded',
				content: {
					'application/json': {
						schema: ExceptionSchema,
					},
				},
			},
		},
	});
}
