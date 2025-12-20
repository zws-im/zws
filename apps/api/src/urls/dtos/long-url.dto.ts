import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const LongUrl = z.object({ url: z.string().url().max(500) }).meta({ title: 'LongUrl' });
export type LongUrl = z.infer<typeof LongUrl>;

export class LongUrlDto extends createZodDto(LongUrl) {}
