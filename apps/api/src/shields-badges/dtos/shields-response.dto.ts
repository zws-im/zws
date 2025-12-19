import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ShieldsResponseSchema = z
	.object({
		schemaVersion: z.literal(1),

		cacheSeconds: z.number().min(300).optional(),

		label: z.string().describe('Label for the badge'),

		message: z.string().describe('Message to display'),

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
	.meta({ id: 'ShieldsResponse' });

export type ShieldsResponseSchema = z.infer<typeof ShieldsResponseSchema>;

export class ShieldsResponseDto extends createZodDto(ShieldsResponseSchema) {}
