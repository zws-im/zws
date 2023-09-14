import { HealthCheckResultSchema } from '../_lib/health/dtos/health.dto';
import { OpenapiTag } from '../_lib/openapi/enums/openapi-tag.enum';
import type { OpenapiService } from '../_lib/openapi/openapi.service';

export function openapi(oas: OpenapiService): void {
	oas.addPath({
		method: 'get',
		path: '/health',
		tags: [OpenapiTag.Health],
		summary: 'Get the health of this ZWS instance',
		responses: {
			200: {
				description: 'Get the health of this ZWS instance',
				content: {
					'application/json': {
						schema: HealthCheckResultSchema,
					},
				},
			},
		},
	});
}
