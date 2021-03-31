import {FastifyInstance, RouteOptions} from 'fastify';
import {server} from '../../config';
import db from '../../db';
import {NotHealthy} from '../errors';

export default function declareRoute(fastify: FastifyInstance) {
	const route: RouteOptions = {
		method: 'GET',
		url: '/health',
		schema: {
			operationId: 'health',
			tags: [server.Tags.Health],
			summary: 'Health check',
			description: 'Check if the instance is healthy',
			response: {204: {}, 500: fastify.getSchema('https://zws.im/schemas/NotHealthyError.json')}
		},
		handler: async (request, reply) => {
			try {
				// Pick any URL to check database
				await db.shortenedUrl.findFirst();
			} catch {
				return new NotHealthy();
			}

			void reply.status(204);
		}
	};

	fastify.route(route);
}
