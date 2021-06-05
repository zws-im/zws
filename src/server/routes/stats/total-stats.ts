import {Http} from '@jonahsnider/util';
import {FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import Stats from '../../../../types/schemas/models/Stats';
import TotalStatsOptions from '../../../../types/schemas/parameters/TotalStatsOptions';
import {server} from '../../../config';
import {instance} from '../../../services';

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
			response: {
				[Http.Status.Ok]: fastify.getSchema('https://zws.im/schemas/Stats.json'),
				[Http.Status.InternalServerError]: fastify.getSchema('https://zws.im/schemas/Error.json')
			}
		},
		handler: async request => {
			const stats = await instance.stats();

			if (request.query.format) {
				return {
					urls: stats.urls.toLocaleString(),
					visits: stats.visits.toLocaleString(),
					version: `v${server.version}`
				};
			}

			return {...stats, version: server.version};
		}
	};

	fastify.route(route);
}
