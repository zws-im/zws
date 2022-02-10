import {Http} from '@jonahsnider/util';
import {Type} from '@zws.im/schemas';
import type {RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';

import * as Schemas from '@zws.im/schemas';
import {OpenApiTags} from '../../../../utils/enums.js';
import {UrlNotFound} from '../../../errors.js';

import {urls} from '../../services.js';

export default function getRoute() {
	const route: RouteOptions<
		RawServerDefault,
		RawRequestDefaultExpression,
		RawReplyDefaultExpression,
		{Params: Schemas.Inputs.Short; Reply: Schemas.Models.UrlStats}
	> = {
		method: 'GET',
		url: '/:short/stats',
		schema: {
			operationId: 'urls-stats',
			summary: 'URL stats',
			description: 'Retrieve usage statistics for a shortened URL',
			tags: [OpenApiTags.Urls, OpenApiTags.Stats],
			params: Type.Ref(Schemas.Inputs.Short),
			response: {
				[Http.Status.Ok]: Type.Ref(Schemas.Models.UrlStats),
				[Http.Status.NotFound]: Type.Ref(Schemas.Errors.UrlNotFound),
			},
		},
		async handler(request) {
			const {
				params: {short},
			} = request;

			const stats = await urls.stats(urls.normalizeShortId(short as urls.Short));

			if (stats === null) {
				throw new UrlNotFound();
			}

			return stats;
		},
	};

	return route;
}
