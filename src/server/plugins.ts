import type {FastifyInstance} from 'fastify';
import bearerAuthPlugin from 'fastify-bearer-auth';
import swaggerPlugin from 'fastify-swagger';
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
			addHook: true,
			keys: new Set([config.server.apiKey]),
			errorResponse: (error: Error) => {
				switch (error.message) {
					case 'missing authorization header':
						return {...new MissingApiKey()} as unknown as {error: string};
					default:
						return {...new IncorrectApiKey()} as unknown as {error: string};
				}
			},
		});
	}
}
