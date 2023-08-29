import { z } from 'zod';
import { LongUrlSchema } from '../../urls/dtos/long-url-dto';

export const UrlStatsSchema = z.object({
	url: LongUrlSchema.shape.url,
	visits: z.array(z.string().datetime()),
});
export type UrlStatsSchema = z.infer<typeof UrlStatsSchema>;
