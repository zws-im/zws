import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { LongUrl } from '../../urls/dtos/long-url.dto.js';

export const UrlStatsSchema = z
	.object({
		url: LongUrl.shape.url,
		visits: z.array(z.string().datetime()),
	})
	.meta({ title: 'UrlStats' });

export type UrlStatsSchema = z.infer<typeof UrlStatsSchema>;

export class UrlStatsDto extends createZodDto(UrlStatsSchema) {}
