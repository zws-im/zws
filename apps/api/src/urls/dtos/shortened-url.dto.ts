import { z } from 'zod';
import { Short } from './short.dto.js';

export const ShortenedUrl = z
	.object({
		short: Short,
		url: z.string().url(),
	})
	.meta({ id: 'ShortenedUrl', title: 'ShortenedUrl' });

export type ShortenedUrl = z.infer<typeof ShortenedUrl>;
