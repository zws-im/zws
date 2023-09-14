import { SchemaObject } from 'openapi3-ts/oas31';
import zodToJsonSchema from 'zod-to-json-schema';
import { ExceptionSchema } from '../../_lib/exceptions/dtos/exception.dto';
import { OpenapiTag } from '../../_lib/openapi/enums/openapi-tag.enum';
import type { OpenapiService } from '../../_lib/openapi/openapi.service';
import { UrlStatsSchema } from '../../_lib/url-stats/dtos/url-stats.dto';
import { ShortSchema } from '../../_lib/urls/dtos/short.dto';

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
