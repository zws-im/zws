import { z } from 'zod';

export const StatsSchema = z.object({
	urls: z.number().int().nonnegative(),
	visits: z.number().int().nonnegative(),
});
export type StatsSchema = z.infer<typeof StatsSchema>;
