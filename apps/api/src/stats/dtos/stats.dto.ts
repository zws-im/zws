import { z } from 'zod';

export const InstanceStats = z
	.object({
		urls: z.number().int().nonnegative(),
		visits: z.number().int().nonnegative(),
	})
	.meta({ id: 'InstanceStats', title: 'InstanceStats' });

export type InstanceStats = z.infer<typeof InstanceStats>;
