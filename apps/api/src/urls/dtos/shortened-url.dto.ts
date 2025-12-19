import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { Short } from './short.dto';

export const ShortenedUrl = z
	.object({
		short: Short,
		url: z.string().url(),
	})
	.meta({ id: 'ShortenedUrl' });

export type ShortenedUrl = z.infer<typeof ShortenedUrl>;

export class ShortenedUrlDto extends createZodDto(ShortenedUrl) {}
