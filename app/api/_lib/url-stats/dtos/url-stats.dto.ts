import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { LongUrlSchema } from '../../urls/dtos/long-url.dto';

extendZodWithOpenApi(z);

export const UrlStatsSchema = z
	.object({
		url: LongUrlSchema.shape.url,
		visits: z.array(z.string().datetime()),
	})
	.openapi('UrlStats');
export type UrlStatsSchema = z.infer<typeof UrlStatsSchema>;
