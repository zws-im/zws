import { NextResponse } from 'next/server';

import { NextRouteHandlerContext, validateParams } from '@jonahsnider/nextjs-api-utils';
import { SchemaObject } from 'openapi3-ts/oas31';
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import { exceptionRouteWrapper } from '../../_lib/exception-route-wrapper';
import { ExceptionSchema } from '../../_lib/exceptions/dtos/exception.dto';
import { OpenapiTag } from '../../_lib/openapi/enums/openapi-tag.enum';
import type { OpenapiService } from '../../_lib/openapi/openapi.service';
import { UrlStatsSchema } from '../../_lib/url-stats/dtos/url-stats.dto';
import { urlStatsService } from '../../_lib/url-stats/url-stats.service';
import { ShortSchema } from '../../_lib/urls/dtos/short.dto';
import { UrlNotFoundException } from '../../_lib/urls/exceptions/url-not-found.exception';

export const GET = exceptionRouteWrapper.wrapRoute<UrlStatsSchema, NextRouteHandlerContext<{ short: string }>>(
	async (_request, context) => {
		const params = validateParams(context, z.object({ short: ShortSchema }));

		const short = params.short;

		const stats = await urlStatsService.statsForUrl(short);

		if (!stats) {
			throw new UrlNotFoundException();
		}

		return NextResponse.json(stats);
	},
);

export function openapi(oas: OpenapiService): void {
	oas.addPath({
		method: 'get',
		path: '/{short}/stats',
		tags: [OpenapiTag.ShortenedUrls],
		summary: 'Get statistics for a shortened URL',
		parameters: [
			{
				in: 'path',
				name: 'short',
				required: true,
				schema: zodToJsonSchema(ShortSchema) as SchemaObject,
			},
		],
		responses: {
			200: {
				description: 'The stats for the URL',
				content: {
					'application/json': {
						schema: UrlStatsSchema,
					},
				},
			},
			404: {
				description: 'The URL was not found',
				content: {
					'application/json': {
						schema: ExceptionSchema,
					},
				},
			},
		},
	});
}
