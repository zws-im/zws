import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const StatsSchema = z
	.object({
		urls: z.number().int().nonnegative(),
		visits: z.number().int().nonnegative(),
	})
	.openapi('Stats');
export type StatsSchema = z.infer<typeof StatsSchema>;
