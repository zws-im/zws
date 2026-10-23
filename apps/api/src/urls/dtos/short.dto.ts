import { z } from 'zod';

export const Short = z.string();
export type Short = z.infer<typeof Short>;
