import {FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import {urls} from '../../../services';
import S from 'fluent-json-schema';
import {server} from '../../../config';

interface Stats<T extends number | string> {
	urls: T;
	visits: T;
	version: string;
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
			const urlStats = await urls.totalStats();

			if (request.query.format) {
				return {
					urls: urlStats.urls.toLocaleString(),
					visits: urlStats.visits.toLocaleString(),
					version: `v${server.version}`
				};
			}

			return {...urlStats, version: server.version};
		}
	};

	fastify.route(route);
}
