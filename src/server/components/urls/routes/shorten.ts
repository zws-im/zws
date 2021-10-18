import {URL} from 'node:url';
import {Http} from '@jonahsnider/util';
import {Type} from '@sinclair/typebox';
import type {FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import * as config from '../../../../config/index.js';

import {fastifyLogger} from '../../../../logger.js';

import * as Schemas from '../../../../schemas/index.js';

import {AttemptedShortenBlockedHostname, AttemptedShortenHostname} from '../../../errors.js';
import {urls} from '../../services.js';
import {OpenApiTags, SECURED_ROUTE} from '../../../../utils/enums.js';

const forbiddenHostnames = new Set([config.server.shortenedBaseUrl?.hostname ?? null, config.server.hostname]);
const domainNameRegExp = /(?:.+\.)?(.+\..+)$/i;

export default function getRoute(fastify: FastifyInstance) {
	const route: RouteOptions<
		RawServerDefault,
		RawRequestDefaultExpression,
		RawReplyDefaultExpression,
		{Body: Schemas.Models.LongUrl; Reply: Schemas.Models.ShortenedUrl}
	> = {
		method: 'POST',
		url: '/',
		schema: {
			operationId: 'urls-shorten',
			summary: 'Shorten URL',
			description: 'Shorten a URL',
			tags: [OpenApiTags.Urls],
			body: Type.Ref(Schemas.Models.LongUrl),
			response: {
				[Http.Status.Created]: Type.Ref(Schemas.Models.ShortenedUrl),
				[Http.Status.Unauthorized]: Type.Ref(Schemas.Errors.ApiKeyError),
				[Http.Status.UnprocessableEntity]: Type.Ref(Schemas.Errors.GenericError),
				// TODO: fast-json-stringify is unable to handle a oneOf/anyOf for some reason, so it serializes to {}
				// [Http.Status.UnprocessableEntity]: Schemas.Errors.ShortenHostnameError,
				[Http.Status.ServiceUnavailable]: Schemas.Errors.UniqueShortIdTimeout,
			},
		},
		handler: async (request, reply) => {
			const {
				body: {url},
			} = request;

			const longUrlHostname = new URL(url).hostname;

			if (forbiddenHostnames.has(longUrlHostname)) {
				throw new AttemptedShortenHostname();
			}

			if (
				// Exact match
				config.blocklist.blockedHostnames.has(longUrlHostname) ||
				// Domain name match
				config.blocklist.blockedHostnames.has(longUrlHostname.replace(domainNameRegExp, '$1'))
			) {
				throw new AttemptedShortenBlockedHostname();
			}

			const id = await urls.shorten(url);

			void reply.code(Http.Status.Created);

			const response: Schemas.Models.ShortenedUrl = {short: id};

			if (config.server.shortenedBaseUrl) {
				response.url = decodeURI(new URL(id, config.server.shortenedBaseUrl).toString());
			}

			return response;
		},
	};

	if (fastify.verifyBearerAuth) {
		route.preHandler = fastify.verifyBearerAuth;

		if (route.schema) {
			route.schema.security = SECURED_ROUTE;
		}
	} else if (config.server.apiKey !== null) {
		fastifyLogger.warn("API key was defined but bearer auth decorator wasn't, this route will not be secured");
	}

	return route;
}
