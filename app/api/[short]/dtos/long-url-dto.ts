import { z } from 'zod';

export const LongUrlSchema = z.object({ url: z.string().url().max(500) });
export type LongUrlSchema = z.infer<typeof LongUrlSchema>;
