import {FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import {Http} from '@jonahsnider/util';
import ShieldsEndpointResponse from '../../../../types/schemas/responses/ShieldsEndpointResponse';
import {server} from '../../../config';

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
		url: '/stats/shields/version',
		schema: {
			operationId: 'shields-version',
			summary: 'Shields endpoint for version',
			description: 'Shields endpoint badge response for instance version',
			tags: [server.Tags.Stats, server.Tags.Shields],
			response: {
				[Http.Status.Ok]: fastify.getSchema('https://zws.im/schemas/ShieldsEndpointResponse.json'),
				[Http.Status.InternalServerError]: fastify.getSchema('https://zws.im/schemas/Error.json')
			}
		},
		handler: async () => ({color: 'informational', label: 'zws', message: `v${server.version}`, schemaVersion: 1})
	};

	fastify.route(route);
}
