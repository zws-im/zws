import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const InstanceStats = extendApi(
	z.object({
		urls: z.number().int().nonnegative(),
		visits: z.number().int().nonnegative(),
	}),
	{
		title: 'Stats',
	},
);

export type InstanceStats = z.infer<typeof InstanceStats>;

export class InstanceStatsDto extends createZodDto(InstanceStats) {}
