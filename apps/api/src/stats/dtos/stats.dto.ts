import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const InstanceStats = z
	.object({
		urls: z.number().int().nonnegative(),
		visits: z.number().int().nonnegative(),
	})
	.meta({ title: 'Stats' });

export type InstanceStats = z.infer<typeof InstanceStats>;

export class InstanceStatsDto extends createZodDto(InstanceStats) {}
