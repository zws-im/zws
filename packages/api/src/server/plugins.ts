import type {FastifyInstance} from 'fastify';
import bearerAuthPlugin from 'fastify-bearer-auth';
import swaggerPlugin from 'fastify-swagger';
import type * as Schemas from '@zws.im/schemas';
import * as config from '../config/index.js';
import {IncorrectApiKey, MissingApiKey} from './errors.js';
import openapi from './openapi.js';

export default async function registerPlugins(fastify: FastifyInstance): Promise<void> {
	await fastify.register(swaggerPlugin, {
		openapi,
		routePrefix: '/docs/api',
		exposeRoute: true,
	});

	if (config.server.apiKey !== null) {
		await fastify.register(bearerAuthPlugin, {
			addHook: false,
			keys: new Set([config.server.apiKey]),
			errorResponse: (error: Error): Schemas.Errors.ApiKeyError => {
				switch (error.message) {
					case 'missing authorization header': {
						const {statusCode, code, message} = new MissingApiKey();

						const built: Schemas.Errors.MissingApiKey = {
							statusCode,
							code,
							message,
							error: 'Unauthorized',
						};

						return built;
					}

					default: {
						const {statusCode, code, message} = new IncorrectApiKey();

						const built: Schemas.Errors.IncorrectApiKey = {
							statusCode,
							code,
							message,
							error: 'Unauthorized',
						};

						return built;
					}
				}
			},
		});
	}
}
