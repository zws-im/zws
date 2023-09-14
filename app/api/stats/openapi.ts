import { StatsSchema } from '@/app/api/_lib/stats/dtos/stats.dto';
import { OpenapiTag } from '../_lib/openapi/enums/openapi-tag.enum';
import type { OpenapiService } from '../_lib/openapi/openapi.service';

export function openapi(oas: OpenapiService): void {
	oas.addPath({
		method: 'get',
		path: '/stats',
		tags: [OpenapiTag.InstanceStats],
		summary: 'Get stats about the API',
		responses: {
			200: {
				description: 'Get stats about the API',
				content: {
					'application/json': {
						schema: StatsSchema,
					},
				},
			},
		},
	});
}
