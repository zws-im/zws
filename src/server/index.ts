import createServer, {RouteOptions} from 'fastify';
import {fastifyLogger} from '../logger';
import routes from './components/routes';
import registerHooks from './hooks';
import registerPlugins from './plugins';
import addSchemas from './schemas';

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
