import {FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import ShieldsEndpointResponse from '../../../../types/schemas/responses/ShieldsEndpointResponse';
import {server} from '../../../config';
import {format, urls} from '../../../services';

export default function declareRoute(fastify: FastifyInstance) {
	const route: RouteOptions<
		RawServerDefault,
		RawRequestDefaultExpression,
		RawReplyDefaultExpression,
		{
			Reply: ShieldsEndpointResponse;
		}
	> = {
		method: 'GET',
		url: '/stats/shields/visits',
		schema: {
			operationId: 'shields-visits',
			summary: 'Shields endpoint for visits',
			description: 'Shields endpoint badge response for total number of shortened URLs visited',
			tags: [server.Tags.Stats, server.Tags.Shields],
			response: {200: fastify.getSchema('https://zws.im/schemas/ShieldsEndpointResponse.json'), 500: fastify.getSchema('https://zws.im/schemas/Error.json')}
		},
		handler: async (request, reply) => {
			const stats = await urls.totalStats();

			return {color: 'informational', label: 'visits', message: format.abbreviateNumber(stats.visits), schemaVersion: 1};
		}
	};

	fastify.route(route);
}
