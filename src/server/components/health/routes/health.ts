import {Http} from '@jonahsnider/util';
import {FastifyInstance, RouteOptions} from 'fastify';
import {server} from '../../../../config';
import db from '../../../../db';
import {NotHealthy} from '../../../errors';

export default function getRoute(fastify: FastifyInstance) {
	const route: RouteOptions = {
		method: 'GET',
		url: '/health',
		schema: {
			operationId: 'health',
			tags: [server.Tags.Health],
			summary: 'Health check',
			description: 'Check if the instance is healthy',
			response: {[Http.Status.NoContent]: {}, [Http.Status.InternalServerError]: fastify.getSchema('https://zws.im/schemas/NotHealthyError.json')}
		},
		handler: async (request, reply) => {
			try {
				// Pick any URL to check database
				await db.shortenedUrl.findFirst();
			} catch {
				return new NotHealthy();
			}

			void reply.status(Http.Status.NoContent);
		}
	};

	return route;
}
