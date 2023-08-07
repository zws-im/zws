import { z } from 'zod';
import { LongUrlSchema } from '../../urls/dtos/long-url-dto';

export const UrlStats = z.object({
	url: LongUrlSchema.shape.url,
	visits: z.array(z.date()),
});
export type UrlStats = z.infer<typeof UrlStats>;
