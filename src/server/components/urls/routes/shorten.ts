// eslint-disable-next-line node/prefer-global/url
import {URL} from 'url';
import {Http} from '@jonahsnider/util';
import {FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import {urls} from '../../services';
import type Short from '../../../../../types/schemas/models/Short';
import type Url from '../../../../../types/schemas/models/Url';
import {blocklist, server} from '../../../../config';
import {fastifyLogger} from '../../../../logger';
import {AttemptedShortenBlockedHostname, AttemptedShortenHostname} from '../../../errors';

const forbiddenHostnames = new Set([server.shortenedBaseUrl?.hostname ?? null, server.hostname]);

export default function getRoute(fastify: FastifyInstance) {
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
				[Http.Status.Created]: fastify.getSchema('https://zws.im/schemas/Short.json'),
				[Http.Status.BadRequest]: fastify.getSchema('https://zws.im/schemas/Error.json'),
				// Should be https://zws.im/schemas/ApiKeyError.json but the schema generator emits bad references
				[Http.Status.Unauthorized]: fastify.getSchema('https://zws.im/schemas/Error.json'),
				// Should be https://zws.im/schemas/ShortenHostnameError.json but the schema generator emits bad references
				[Http.Status.UnprocessableEntity]: fastify.getSchema('https://zws.im/schemas/Error.json'),
				[Http.Status.InternalServerError]: fastify.getSchema('https://zws.im/schemas/Error.json'),
				[Http.Status.ServiceUnavailable]: fastify.getSchema('https://zws.im/schemas/UniqueShortIdTimeoutError.json')
			}
		},
		handler: async (request, reply) => {
			const {
				body: {url}
			} = request;

			const longUrlHostname = new URL(url).hostname;

			if (forbiddenHostnames.has(longUrlHostname)) {
				throw new AttemptedShortenHostname();
			}

			if (blocklist.blockedHostnames.has(longUrlHostname)) {
				throw new AttemptedShortenBlockedHostname();
			}

			const id = await urls.shorten(url);

			void reply.code(Http.Status.Created);

			const response: Short = {short: id};

			if (server.shortenedBaseUrl) {
				response.url = decodeURI(new URL(id, server.shortenedBaseUrl).toString());
			}

			return response;
		}
	};

	if (fastify.verifyBearerAuth) {
		route.preHandler = fastify.auth([fastify.verifyBearerAuth]);
	} else if (server.apiKey !== null) {
		fastifyLogger.warn("API key was defined but bearer auth decorator wasn't");
	}

	return route;
}
