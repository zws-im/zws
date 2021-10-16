import {Http} from '@jonahsnider/util';
import type {RouteOptions} from 'fastify';
import {server} from '../../../../config';
import db from '../../../../db';
import * as Schemas from '../../../../schemas';
import {NotHealthy} from '../../../errors';

export default function getRoute() {
	const route: RouteOptions = {
		method: 'GET',
		url: '/health',
		schema: {
			operationId: 'health',
			tags: [server.Tags.Health],
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
