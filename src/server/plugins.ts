import {FastifyInstance} from 'fastify';
import authPlugin from 'fastify-auth';
import bearerAuthPlugin from 'fastify-bearer-auth';
import swaggerPlugin from 'fastify-swagger';
import {server} from '../config';
import {configLogger} from '../logger';
import {IncorrectApiKey, MissingApiKey} from './errors';
import openapi from './openapi';

export default async function registerPlugins(fastify: FastifyInstance): Promise<void> {
	const plugins = [
		fastify.register(swaggerPlugin, {
			openapi,
			routePrefix: '/docs/api',
			exposeRoute: true
		})
	];

	if (server.apiKey === null) {
		configLogger.info('No API key provided, access to all routes will be public');
	} else {
		configLogger.info('Using API key to restrict access to routes');

		plugins.push(
			fastify.register(bearerAuthPlugin, {
				addHook: false,
				keys: new Set([server.apiKey]),
				errorResponse: (error: Error) => {
					switch (error.message) {
						case 'missing authorization header':
							return new MissingApiKey() as unknown as {error: string};
						default:
							return new IncorrectApiKey() as unknown as {error: string};
					}
				}
			}),
			fastify.register(authPlugin)
		);
	}

	await Promise.all(plugins);
}
