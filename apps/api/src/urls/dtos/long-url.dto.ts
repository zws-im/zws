import { z } from 'zod';

export const LongUrl = z.object({ url: z.string().url().max(500) }).meta({ id: 'LongUrl', title: 'LongUrl' });
export type LongUrl = z.infer<typeof LongUrl>;
