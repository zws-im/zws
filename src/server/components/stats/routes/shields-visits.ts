import {Http} from '@jonahsnider/util';
import {Type} from '@sinclair/typebox';
import {RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import {server} from '../../../../config';
import * as Schemas from '../../../../schemas';

import {stats} from '../../services';

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
		url: '/stats/shields/visits',
		schema: {
			operationId: 'shields-visits',
			summary: 'Shields endpoint for visits',
			description: 'Shields endpoint badge response for total number of shortened URLs visited',
			tags: [server.Tags.Stats, server.Tags.Shields],
			response: {
				[Http.Status.Ok]: Type.Ref(Schemas.Models.ShieldsEndpointResponse),
			},
		},
		handler: async () => {
			const instanceStats = await stats.instanceStats();

			return {color: 'informational', label: 'visits', message: stats.abbreviateNumber(instanceStats.visits), schemaVersion: 1};
		},
	};

	return route;
}
