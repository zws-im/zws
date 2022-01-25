import {Http} from '@jonahsnider/util';
import {Type} from '@zws.im/schemas';
import type {RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import * as Schemas from '@zws.im/schemas';
import * as config from '../../../../config/index.js';

import {OpenApiTags} from '../../../../utils/enums.js';

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
		url: '/stats/shields/version',
		schema: {
			operationId: 'shields-version',
			summary: 'Shields endpoint for version',
			description: 'Shields endpoint badge response for instance version',
			tags: [OpenApiTags.Stats, OpenApiTags.Shields],
			response: {
				[Http.Status.Ok]: Type.Ref(Schemas.Models.ShieldsEndpointResponse),
			},
		},
		handler: async () => ({color: 'informational', label: 'zws', message: `v${config.server.version}`, schemaVersion: 1}),
	};

	return route;
}
