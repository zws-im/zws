import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const HealthCheckResultSchema = z
	.object({
		status: z.literal('ok'),
	})
	.describe('A health check result')
	.openapi('HealthCheckResult');

export type HealthCheckResultSchema = z.infer<typeof HealthCheckResultSchema>;
