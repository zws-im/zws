import {Http} from '@jonahsnider/util';
import {FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import Stats from '../../../../../types/schemas/models/Stats';
import TotalStatsOptions from '../../../../../types/schemas/parameters/TotalStatsOptions';
import {server} from '../../../../config';
import {stats} from '../../services';

export default function getRoute(fastify: FastifyInstance) {
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
			const instanceStats = await stats.instanceStats();

			if (request.query.format) {
				return {
					urls: instanceStats.urls.toLocaleString(),
					visits: instanceStats.visits.toLocaleString(),
					version: `v${server.version}`
				};
			}

			return {...instanceStats, version: server.version};
		}
	};

	return route;
}
