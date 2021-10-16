import {URL} from 'node:url';
import {Http} from '@jonahsnider/util';
import {Type} from '@sinclair/typebox';
import type {FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import {blocklist, server} from '../../../../config';
import {fastifyLogger} from '../../../../logger';

import * as Schemas from '../../../../schemas';

import {AttemptedShortenBlockedHostname, AttemptedShortenHostname} from '../../../errors';
import {urls} from '../../services';

const forbiddenHostnames = new Set([server.shortenedBaseUrl?.hostname ?? null, server.hostname]);
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
			tags: [server.Tags.Urls],
			body: Type.Ref(Schemas.Models.LongUrl),
			security: [{[server.SecuritySchemes.ApiKey]: ['']}],
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
				blocklist.blockedHostnames.has(longUrlHostname) ||
				// Domain name match
				blocklist.blockedHostnames.has(longUrlHostname.replace(domainNameRegExp, '$1'))
			) {
				throw new AttemptedShortenBlockedHostname();
			}

			const id = await urls.shorten(url);

			void reply.code(Http.Status.Created);

			const response: Schemas.Models.ShortenedUrl = {short: id};

			if (server.shortenedBaseUrl) {
				response.url = decodeURI(new URL(id, server.shortenedBaseUrl).toString());
			}

			return response;
		},
	};

	if (fastify.verifyBearerAuth) {
		route.preHandler = fastify.auth([fastify.verifyBearerAuth]);
	} else if (server.apiKey !== null) {
		fastifyLogger.warn("API key was defined but bearer auth decorator wasn't");
	}

	return route;
}
