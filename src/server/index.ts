import createServer from 'fastify';
import {fastifyLogger} from '../logger';
import registerHooks from './hooks';
import registerPlugins from './plugins';
import * as routes from './routes';
import addSchemas from './schemas';

const fastify = createServer({
	maxParamLength: 1024
});

registerPlugins(fastify).catch(error => {
	fastifyLogger.error('Failed to register plugins', error);
});

registerHooks(fastify);

addSchemas(fastify);

fastify.after(() => {
	for (const declareRoute of Object.values(routes)) {
		declareRoute(fastify);
	}
});

export default fastify;
