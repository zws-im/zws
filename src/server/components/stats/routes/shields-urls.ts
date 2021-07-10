import {Http} from '@jonahsnider/util';
import {FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import {stats} from '../../services';
import ShieldsEndpointResponse from '../../../../../types/schemas/responses/ShieldsEndpointResponse';
import {server} from '../../../../config';

export default function getRoute(fastify: FastifyInstance) {
	const route: RouteOptions<
		RawServerDefault,
		RawRequestDefaultExpression,
		RawReplyDefaultExpression,
		{
			Reply: ShieldsEndpointResponse;
		}
	> = {
		method: 'GET',
		url: '/stats/shields/urls',
		schema: {
			operationId: 'shields-urls',
			summary: 'Shields endpoint for URLs',
			description: 'Shields endpoint badge response for total number of URLs shortened',
			tags: [server.Tags.Stats, server.Tags.Shields],
			response: {
				[Http.Status.Ok]: fastify.getSchema('https://zws.im/schemas/ShieldsEndpointResponse.json'),
				[Http.Status.InternalServerError]: fastify.getSchema('https://zws.im/schemas/Error.json'),
			},
		},
		handler: async () => {
			const instanceStats = await stats.instanceStats();

			return {color: 'informational', label: 'urls', message: stats.abbreviateNumber(instanceStats.urls), schemaVersion: 1};
		},
	};

	return route;
}
