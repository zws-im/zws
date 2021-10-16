import type {RouteOptions} from 'fastify';
import createServer from 'fastify';
import {fastifyLogger} from '../logger.js';
import routes from './components/routes.js';
import registerHooks from './hooks.js';
import registerPlugins from './plugins.js';
import addSchemas from './schemas.js';

const fastify = createServer({
	maxParamLength: 1024,
});

registerPlugins(fastify).catch(error => {
	fastifyLogger.error('Failed to register plugins', error);
});

registerHooks(fastify);

addSchemas(fastify);

fastify.after(() => {
	for (const getRoute of routes) {
		fastify.route(getRoute(fastify) as RouteOptions);
	}
});

export default fastify;
