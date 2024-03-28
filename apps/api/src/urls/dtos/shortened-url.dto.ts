import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { Short } from './short.dto';

export const ShortenedUrl = extendApi(
	z.object({
		short: Short,
		url: z.string().url(),
	}),
	{
		title: 'ShortenedUrl',
	},
);

export type ShortenedUrl = z.infer<typeof ShortenedUrl>;

export class ShortenedUrlDto extends createZodDto(ShortenedUrl) {}
