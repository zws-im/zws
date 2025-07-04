import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { LongUrl } from '../../urls/dtos/long-url.dto';

export const UrlStatsSchema = extendApi(
	z.object({
		url: LongUrl.shape.url,
		visits: z.array(z.string().datetime()),
	}),
	{
		title: 'UrlStats',
	},
);

export type UrlStatsSchema = z.infer<typeof UrlStatsSchema>;

export class UrlStatsDto extends createZodDto(UrlStatsSchema) {}
