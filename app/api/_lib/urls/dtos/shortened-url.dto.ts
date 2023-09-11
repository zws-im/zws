import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { ShortSchema } from './short.dto';

extendZodWithOpenApi(z);

export const ShortenedUrlSchema = z
	.object({
		short: ShortSchema,
		url: z.string().url().optional(),
	})
	.openapi('ShortenedUrl');
export type ShortenedUrlSchema = z.infer<typeof ShortenedUrlSchema>;
