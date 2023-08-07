import { z } from 'zod';
import { ShortSchema } from '../[short]/dtos/short.dto';

export const ShortenedUrlSchema = z.object({
	short: ShortSchema,
	url: z.string().url().optional(),
});
export type ShortenedUrlSchema = z.infer<typeof ShortenedUrlSchema>;
