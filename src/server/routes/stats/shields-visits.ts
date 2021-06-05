import {FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import {Http} from '@jonahsnider/util';
import ShieldsEndpointResponse from '../../../../types/schemas/responses/ShieldsEndpointResponse';
import {server} from '../../../config';
import {format, instance} from '../../../services';

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
			response: {
				[Http.Status.Ok]: fastify.getSchema('https://zws.im/schemas/ShieldsEndpointResponse.json'),
				[Http.Status.InternalServerError]: fastify.getSchema('https://zws.im/schemas/Error.json')
			}
		},
		handler: async () => {
			const stats = await instance.stats();

			return {color: 'informational', label: 'visits', message: format.abbreviateNumber(stats.visits), schemaVersion: 1};
		}
	};

	fastify.route(route);
}
