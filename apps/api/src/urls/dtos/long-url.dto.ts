import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const LongUrl = extendApi(z.object({ url: z.string().url().max(500) }), {
	title: 'LongUrl',
});
export type LongUrl = z.infer<typeof LongUrl>;

export class LongUrlDto extends createZodDto(LongUrl) {}
