import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const LongUrlSchema = z.object({ url: z.string().url().max(500) }).openapi('LongUrl');
export type LongUrlSchema = z.infer<typeof LongUrlSchema>;
