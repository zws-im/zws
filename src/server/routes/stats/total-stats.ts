import {FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import Stats from '../../../../types/schemas/models/Stats';
import TotalStatsOptions from '../../../../types/schemas/parameters/TotalStatsOptions';
import {server} from '../../../config';
import {urls} from '../../../services';

export default function declareRoute(fastify: FastifyInstance) {
	const route: RouteOptions<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, {Querystring: TotalStatsOptions; Reply: Stats}> = {
		method: 'GET',
		url: '/stats',
		schema: {
			operationId: 'total-stats',
			tags: [server.Tags.Stats, server.Tags.Shields],
			summary: 'Total statistics',
			description: 'Total usage statistics for this instance',
			querystring: fastify.getSchema('https://zws.im/schemas/TotalStatsOptions.json'),
			response: {200: fastify.getSchema('https://zws.im/schemas/Stats.json'), 500: fastify.getSchema('https://zws.im/schemas/Error.json')}
		},
		handler: async request => {
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
