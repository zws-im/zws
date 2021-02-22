import {FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import {format, urls} from '../../../services';

export default function declareRoute(fastify: FastifyInstance) {
	const route: RouteOptions<
		RawServerDefault,
		RawRequestDefaultExpression,
		RawReplyDefaultExpression,
		{
			Reply: {
				schemaVersion: 1;
				label: 'visits';
				message: string;
				color: 'informational';
			};
		}
	> = {
		method: 'GET',
		url: '/stats/shields/visits',
		handler: async (request, reply) => {
			const stats = await urls.totalStats();

			return {color: 'informational', label: 'visits', message: format.abbreviateNumber(stats.visits), schemaVersion: 1};
		}
	};

	fastify.route(route);
}
