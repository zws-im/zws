import {Http} from '@jonahsnider/util';
import {Type} from '@sinclair/typebox';
import {RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import {server} from '../../../../config';
import {stats} from '../../services';
import * as Schemas from '../../../../schemas';

export default function getRoute() {
	const route: RouteOptions<
		RawServerDefault,
		RawRequestDefaultExpression,
		RawReplyDefaultExpression,
		{
			Reply: Schemas.Models.ShieldsEndpointResponse;
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
				[Http.Status.Ok]: Type.Ref(Schemas.Models.ShieldsEndpointResponse),
			},
		},
		handler: async () => {
			const instanceStats = await stats.instanceStats();

			return {color: 'informational', label: 'urls', message: stats.abbreviateNumber(instanceStats.urls), schemaVersion: 1};
		},
	};

	return route;
}
