import { QueryBooleanSchema } from 'next-api-utils';
import { SchemaObject } from 'openapi3-ts/oas31';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { ExceptionSchema } from '../_lib/exceptions/dtos/exception.dto';
import { OpenapiTag } from '../_lib/openapi/enums/openapi-tag.enum';
import type { OpenapiService } from '../_lib/openapi/openapi.service';
import { LongUrlSchema } from '../_lib/urls/dtos/long-url.dto';
import { ShortSchema } from '../_lib/urls/dtos/short.dto';

export function openapi(oas: OpenapiService): void {
	oas.addPath({
		method: 'get',
		path: '/{short}',
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
