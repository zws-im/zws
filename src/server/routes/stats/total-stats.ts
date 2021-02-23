import {FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import {urls} from '../../../services';
import S from 'fluent-json-schema';

interface Stats<T extends number | string> {
	urls: T;
	visits: T;
}
export default function declareRoute(fastify: FastifyInstance) {
	const route: RouteOptions<
		RawServerDefault,
		RawRequestDefaultExpression,
		RawReplyDefaultExpression,
		{Querystring: {format: boolean}; Reply: Stats<number> | Stats<string>}
	> = {
		method: 'GET',
		url: '/stats',
		schema: {
			querystring: S.object().prop('format', S.boolean().default(false))
		},
		handler: async (request, reply) => {
			const stats = await urls.totalStats();

			if (request.query.format) {
				return {urls: stats.urls.toLocaleString(), visits: stats.visits.toLocaleString()};
			}

			return stats;
		}
	};

	fastify.route(route);
}
