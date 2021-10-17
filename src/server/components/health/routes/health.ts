import {Http} from '@jonahsnider/util';
import type {RouteOptions} from 'fastify';
import {OpenApiTags} from '../../../../utils/enums.js';

import db from '../../../../db.js';
import * as Schemas from '../../../../schemas/index.js';
import {NotHealthy} from '../../../errors.js';

export default function getRoute() {
	const route: RouteOptions = {
		method: 'GET',
		url: '/health',
		schema: {
			operationId: 'health',
			tags: [OpenApiTags.Health],
			summary: 'Health check',
			description: 'Check if the instance is healthy',
			response: {[Http.Status.NoContent]: {}, [Http.Status.InternalServerError]: Schemas.Errors.NotHealthy},
		},
		handler: async (request, reply) => {
			try {
				// Pick any URL to check database
				await db.shortenedUrl.findFirst();
			} catch {
				return new NotHealthy();
			}

			void reply.status(Http.Status.NoContent);
		},
	};

	return route;
}
