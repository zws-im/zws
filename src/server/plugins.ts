import type {FastifyInstance} from 'fastify';
import authPlugin from 'fastify-auth';
import bearerAuthPlugin from 'fastify-bearer-auth';
import swaggerPlugin from 'fastify-swagger';
import {server} from '../config/index.js';
import {configLogger} from '../logger.js';
import {IncorrectApiKey, MissingApiKey} from './errors.js';
import openapi from './openapi.js';

export default async function registerPlugins(fastify: FastifyInstance): Promise<void> {
	const plugins = [
		fastify.register(swaggerPlugin, {
			openapi,
			routePrefix: '/docs/api',
			exposeRoute: true,
		}),
	];

	if (config.server.apiKey !== null) {
		plugins.push(
			fastify.register(bearerAuthPlugin, {
				keys: new Set([config.server.apiKey]),
				// TODO: fastify-bearer-auth v6 makes this error response logic stop working
				errorResponse: (error: Error) => {
					switch (error.message) {
						case 'missing authorization header':
							return new MissingApiKey() as unknown as {error: string};
						default:
							return new IncorrectApiKey() as unknown as {error: string};
					}
				},
			}),
			fastify.register(authPlugin),
		);
	}

	await Promise.all(plugins);
}
