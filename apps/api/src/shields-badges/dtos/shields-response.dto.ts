import { createZodDto } from '@anatine/zod-nestjs';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const ShieldsResponseSchema = z
	.object({
		schemaVersion: z.literal(1),

		cacheSeconds: z.number().min(300).optional(),

		label: z.string().openapi({ examples: ['urls'] }),

		message: z.string().openapi({ examples: ['3.4M'] }),

		color: z.string().optional(),
		labelColor: z.string().optional(),
		isError: z.string().optional(),
		namedLogo: z.string().optional(),
		logoSvg: z.string().optional(),
		logoColor: z.string().optional(),
		logoWidth: z.string().optional(),
		logoPosition: z.string().optional(),
		style: z.string().optional(),
	})
	.openapi({
		title: 'ShieldsResponse',
	});

export type ShieldsResponseSchema = z.infer<typeof ShieldsResponseSchema>;

export class ShieldsResponseDto extends createZodDto(ShieldsResponseSchema) {}
