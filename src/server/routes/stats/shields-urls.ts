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
				label: 'urls';
				message: string;
				color: 'informational';
			};
		}
	> = {
		method: 'GET',
		url: '/stats/shields/urls',
		handler: async (request, reply) => {
			const stats = await urls.totalStats();

			return {color: 'informational', label: 'urls', message: format.abbreviateNumber(stats.urls), schemaVersion: 1};
		}
	};

	fastify.route(route);
}
