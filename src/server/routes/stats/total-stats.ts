import {FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import {urls} from '../../../services';

export default function declareRoute(fastify: FastifyInstance) {
	const route: RouteOptions<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, {Reply: {urls: number; visits: number}}> = {
		method: 'GET',
		url: '/stats',
		handler: async (request, reply) => {
			const stats = await urls.totalStats();

			return stats;
		}
	};

	fastify.route(route);
}
