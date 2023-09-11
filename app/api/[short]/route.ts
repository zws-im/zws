import {
	NextRouteHandlerContext,
	QueryBooleanSchema,
	validateParams,
	validateQuery,
} from '@jonahsnider/nextjs-api-utils';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { SchemaObject } from 'openapi3-ts/oas31';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { exceptionRouteWrapper } from '../_lib/exception-route-wrapper';
import { ExceptionSchema } from '../_lib/exceptions/dtos/exception.dto';
import { OpenapiTag } from '../_lib/openapi/enums/openapi-tag.enum';
import type { OpenapiService } from '../_lib/openapi/openapi.service';
import { urlStatsService } from '../_lib/url-stats/url-stats.service';
import { LongUrlSchema } from '../_lib/urls/dtos/long-url.dto';
import { ShortSchema } from '../_lib/urls/dtos/short.dto';
import { UrlBlockedException } from '../_lib/urls/exceptions/url-blocked.exception';
import { UrlNotFoundException } from '../_lib/urls/exceptions/url-not-found.exception';
import { urlsService } from '../_lib/urls/urls.service';

export const GET = exceptionRouteWrapper.wrapRoute<LongUrlSchema, NextRouteHandlerContext<{ short: string }>>(
	async (request, context) => {
		const params = validateParams(context, z.object({ short: ShortSchema }));
		const short = params.short;
		const query = validateQuery(request, z.object({ visit: QueryBooleanSchema.optional() }));

		const url = await urlsService.retrieveUrl(short);

		if (!url) {
			throw new UrlNotFoundException();
		}

		if (url.blocked) {
			throw new UrlBlockedException();
		}

		if (query.visit !== false) {
			await urlStatsService.trackUrlVisit(short);

			redirect(url.longUrl);
		}

		return NextResponse.json({ url: url.longUrl });
	},
);

export function openapi(oas: OpenapiService): void {
	oas.addPath({
		method: 'get',
		path: '/:short',
		tags: [OpenapiTag.ShortenedUrls],
		summary: 'Visit or retrieve a shortened URL',
		parameters: [
			{
				in: 'path',
				name: 'short',
				required: true,
				schema: zodToJsonSchema(ShortSchema) as SchemaObject,
			},
			{
				in: 'query',
				name: 'visit',
				required: false,
				schema: zodToJsonSchema(QueryBooleanSchema) as SchemaObject,
			},
		],
		responses: {
			200: {
				description: 'Get the long URL for a short URL',
				content: {
					'application/json': {
						schema: LongUrlSchema,
					},
				},
			},
			302: {
				description: 'Redirect to the long URL',
			},
			404: {
				description: 'The short URL was not found',
				content: {
					'application/json': {
						schema: ExceptionSchema,
					},
				},
			},
			410: {
				description: 'The short URL was blocked',
				content: {
					'application/json': {
						schema: ExceptionSchema,
					},
				},
			},
		},
	});
}
