import {FastifyInstance} from 'fastify';
import authPlugin from 'fastify-auth';
import bearerAuthPlugin from 'fastify-bearer-auth';
import {server} from '../config';
import {configLogger} from '../logger';
import {IncorrectApiKey, MissingApiKey} from './errors';

export default async function registerPlugins(fastify: FastifyInstance): Promise<void> {
	if (server.apiKey === null) {
		configLogger.info('No API key provided, access to all routes will be public');
	} else {
		configLogger.info('Using API key to restrict access to routes');

		await Promise.all([
			fastify.register(bearerAuthPlugin, {
				addHook: false,
				keys: new Set([server.apiKey]),
				errorResponse: (error: Error) => {
					console.log(JSON.stringify(error.message, null, 2));

					switch (error.message) {
						case 'missing authorization header':
							return (new MissingApiKey() as unknown) as {error: string};
						default:
							return (new IncorrectApiKey() as unknown) as {error: string};
					}
				}
			}),
			fastify.register(authPlugin)
		]);
	}
}
