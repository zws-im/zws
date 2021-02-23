import {FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import {server} from '../../../config';

export default function declareRoute(fastify: FastifyInstance) {
	const route: RouteOptions<
		RawServerDefault,
		RawRequestDefaultExpression,
		RawReplyDefaultExpression,
		{
			Reply: {
				schemaVersion: 1;
				label: 'zws';
				message: string;
				color: 'informational';
			};
		}
	> = {
		method: 'GET',
		url: '/stats/shields/version',
		handler: async (request, reply) => ({color: 'informational', label: 'zws', message: `v${server.version}`, schemaVersion: 1})
	};

	fastify.route(route);
}
