import {FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
// eslint-disable-next-line node/prefer-global/url
import {URL} from 'url';
import type Url from '../../../../types/schemas/models/Url';
import type Short from '../../../../types/schemas/models/Short';
import {server} from '../../../config';
import {fastifyLogger} from '../../../logger';
import {urls} from '../../../services';
import {AttemptedShortenHostname} from '../../errors';

export default function declareRoute(fastify: FastifyInstance) {
	const route: RouteOptions<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, {Body: Url; Reply: Short}> = {
		method: 'POST',
		url: '/',
		schema: {
			operationId: 'urls-shorten',
			summary: 'Shorten URL',
			description: 'Shorten a URL',
			tags: [server.Tags.Urls],
			body: fastify.getSchema('https://zws.im/schemas/Url.json'),
			security: [{'API key': ['']}],
			response: {
				201: fastify.getSchema('https://zws.im/schemas/Short.json'),
				400: fastify.getSchema('https://zws.im/schemas/Error.json'),
				401: fastify.getSchema('https://zws.im/schemas/ApiKeyError.json'),
				422: fastify.getSchema('https://zws.im/schemas/AttemptedShortenHostnameError.json'),
				500: fastify.getSchema('https://zws.im/schemas/Error.json'),
				503: fastify.getSchema('https://zws.im/schemas/UniqueShortIdTimeoutError.json')
			}
		},
		handler: async (request, reply) => {
			const {
				body: {url}
			} = request;

			if (new URL(url).hostname === server.hostname) {
				throw new AttemptedShortenHostname();
			}

			const id = await urls.shorten(url);

			void reply.code(201);

			return {short: id};
		}
	};

	if (fastify.verifyBearerAuth) {
		route.preHandler = fastify.auth([fastify.verifyBearerAuth]);
	} else if (server.apiKey !== null) {
		fastifyLogger.warn("API key was defined but bearer auth decorator wasn't");
	}

	fastify.route(route);
}
