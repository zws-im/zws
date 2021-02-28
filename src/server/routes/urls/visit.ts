import {FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import Short from '../../../../types/schemas/models/Short';
import Url from '../../../../types/schemas/models/Url';
import VisitOptions from '../../../../types/schemas/parameters/VisitOptions';
import {server} from '../../../config';
import {urls} from '../../../services';
import {UrlNotFound} from '../../errors';

export default function declareRoute(fastify: FastifyInstance) {
	const route: RouteOptions<
		RawServerDefault,
		RawRequestDefaultExpression,
		RawReplyDefaultExpression,
		{Params: Short; Querystring: VisitOptions; Reply: Url}
	> = {
		method: 'GET',
		url: '/:short',
		schema: {
			operationId: 'urls-visit',
			tags: [server.Tags.Urls],
			params: fastify.getSchema('https://zws.im/schemas/Short.json'),
			querystring: fastify.getSchema('https://zws.im/schemas/VisitOptions.json'),
			response: {
				200: fastify.getSchema('https://zws.im/schemas/Url.json'),
				404: fastify.getSchema('https://zws.im/schemas/UrlNotFoundError.json'),
				500: fastify.getSchema('https://zws.im/schemas/Error.json')
			}
		},
		handler: async (request, reply) => {
			const {
				query: {visit},
				params: {short}
			} = request;

			if (short === '') {
				reply.callNotFound();
				return;
			}

			const url = await urls.visit(urls.normalizeShortId(short), true);

			if (url === null) {
				throw new UrlNotFound();
			}

			if (visit) {
				void reply.redirect(301, url);
			} else {
				return {url};
			}
		}
	};

	fastify.route(route);
}
