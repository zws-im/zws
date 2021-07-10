import {Http} from '@jonahsnider/util';
import {FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import Short from '../../../../../types/schemas/models/Short';
import Url from '../../../../../types/schemas/models/Url';
import VisitOptions from '../../../../../types/schemas/parameters/VisitOptions';
import {server} from '../../../../config';
import {UrlBlocked, UrlNotFound} from '../../../errors';
import {urls} from '../../services';

export default function getRoute(fastify: FastifyInstance) {
	const route: RouteOptions<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, {Params: Short; Querystring: VisitOptions; Reply: Url}> =
		{
			method: 'GET',
			url: '/:short',
			schema: {
				operationId: 'urls-visit',
				tags: [server.Tags.Urls],
				params: fastify.getSchema('https://zws.im/schemas/Short.json'),
				querystring: fastify.getSchema('https://zws.im/schemas/VisitOptions.json'),
				response: {
					[Http.Status.Ok]: fastify.getSchema('https://zws.im/schemas/Url.json'),
					[Http.Status.NotFound]: fastify.getSchema('https://zws.im/schemas/UrlNotFoundError.json'),
					[Http.Status.InternalServerError]: fastify.getSchema('https://zws.im/schemas/Error.json'),
				},
			},
			handler: async (request, reply) => {
				const {
					query: {visit},
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

				if (visit) {
					if (url.blocked) {
						// Don't allow users to visit blocked URLs
						throw new UrlBlocked();
					}

					const userAgent = request.headers['user-agent']?.toLowerCase();
					const redirect = userAgent?.includes('discord') || userAgent?.endsWith('firefox/38.0') ? Http.Status.Found : Http.Status.PermanentRedirect;
					// If you don't encode `url` the node http library may crash with TypeError [ERR_INVALID_CHAR]: Invalid character in header content ["location"]
					void reply.redirect(redirect, encodeURI(url.longUrl));
				} else {
					return {url: url.longUrl};
				}
			},
		};

	return route;
}
