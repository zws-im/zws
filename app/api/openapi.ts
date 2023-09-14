import { SchemaObject } from 'openapi3-ts/oas31';
import zodToJsonSchema from 'zod-to-json-schema';
import { ExceptionSchema } from './_lib/exceptions/dtos/exception.dto';
import { OpenapiTag } from './_lib/openapi/enums/openapi-tag.enum';
import { OpenapiService } from './_lib/openapi/openapi.service';
import { LongUrlSchema } from './_lib/urls/dtos/long-url.dto';
import { ShortenedUrlSchema } from './_lib/urls/dtos/shortened-url.dto';

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
