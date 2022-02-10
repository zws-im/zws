import {Http} from '@jonahsnider/util';
import {Type} from '@zws.im/schemas';
import type {RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import * as Schemas from '@zws.im/schemas';
import {OpenApiTags} from '../../../../utils/enums.js';

import {stats} from '../../services.js';

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
			tags: [OpenApiTags.Stats, OpenApiTags.Shields],
			response: {
				[Http.Status.Ok]: Type.Ref(Schemas.Models.ShieldsEndpointResponse),
			},
		},
		async handler() {
			const instanceStats = await stats.instanceStats();

			return {color: 'informational', label: 'urls', message: stats.abbreviateNumber(instanceStats.urls), schemaVersion: 1};
		},
	};

	return route;
}
