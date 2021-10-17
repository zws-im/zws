import {Http} from '@jonahsnider/util';
import {Type} from '@sinclair/typebox';
import type {RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import {OpenApiTags} from '../../../../utils/enums.js';

import * as Schemas from '../../../../schemas/index.js';
import {UrlBlocked, UrlNotFound} from '../../../errors.js';
import {urls} from '../../services.js';

export default function getRoute() {
	const route: RouteOptions<
		RawServerDefault,
		RawRequestDefaultExpression,
		RawReplyDefaultExpression,
		{Params: Schemas.Inputs.Short; Querystring: Schemas.Inputs.Visit; Reply: Schemas.Models.LongUrl}
	> = {
		method: 'GET',
		url: '/:short',
		schema: {
			operationId: 'urls-visit',
			tags: [OpenApiTags.Urls],
			params: Type.Ref(Schemas.Inputs.Short),
			querystring: Schemas.Inputs.Visit,
			response: {
				[Http.Status.Ok]: Type.Ref(Schemas.Models.LongUrl),
				[Http.Status.NotFound]: Type.Ref(Schemas.Errors.UrlNotFound),
				[Http.Status.Gone]: Schemas.Errors.UrlBlocked,
			},
		},
		handler: async (request, reply) => {
			const {
				query: {visit: shouldVisit},
				params: {short},
			} = request;

			if (short === '') {
				reply.callNotFound();
				return;
			}

			const url = await urls.visit(urls.normalizeShortId(short as urls.Short), true);

			if (url === null) {
				throw new UrlNotFound();
			}

			if (shouldVisit) {
				if (url.blocked) {
					// Don't allow users to visit blocked URLs
					throw new UrlBlocked();
				}

				// If you don't encode `url` the node http library may crash with TypeError [ERR_INVALID_CHAR]: Invalid character in header content ["location"]
				void reply.redirect(Http.Status.PermanentRedirect, encodeURI(url.longUrl));
			} else {
				return {url: url.longUrl};
			}
		},
	};

	return route;
}
