import {Http} from '@jonahsnider/util';
import {Type} from '@sinclair/typebox';
import type {RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import {server} from '../../../../config/index.js';
import * as Schemas from '../../../../schemas/index.js';

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
			tags: [server.Tags.Stats, server.Tags.Shields],
			response: {
				[Http.Status.Ok]: Type.Ref(Schemas.Models.ShieldsEndpointResponse),
			},
		},
		handler: async () => ({color: 'informational', label: 'zws', message: `v${server.version}`, schemaVersion: 1}),
	};

	return route;
}
