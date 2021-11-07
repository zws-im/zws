import {Http} from '@jonahsnider/util';
import {Type} from '@sinclair/typebox';
import type {RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import {OpenApiTags} from '../../../../utils/enums.js';
import * as Schemas from '../../../../schemas/index.js';
import * as config from '../../../../config/index.js';

import {stats} from '../../services.js';

export default function getRoute() {
	const route: RouteOptions<
		RawServerDefault,
		RawRequestDefaultExpression,
		RawReplyDefaultExpression,
		{Querystring: Schemas.Inputs.Formatting; Reply: Schemas.Models.Stats}
	> = {
		method: 'GET',
		url: '/stats',
		schema: {
			operationId: 'total-stats',
			tags: [OpenApiTags.Stats, OpenApiTags.Shields],
			summary: 'Total statistics',
			description: 'Total usage statistics for this instance',
			querystring: Schemas.Inputs.Formatting,
			response: {
				[Http.Status.Ok]: Type.Ref(Schemas.Models.Stats),
			},
		},
		handler: async request => {
			const instanceStats = await stats.instanceStats();

			if (request.query.format) {
				return {
					urls: instanceStats.urls.toLocaleString(),
					visits: instanceStats.visits.toLocaleString(),
					version: `v${config.server.version}`,
				};
			}

			return {...instanceStats, version: config.server.version};
		},
	};

	return route;
}
