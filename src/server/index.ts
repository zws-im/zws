import convert from 'convert';
import createServer from 'fastify';
import {heroku} from '../config/env';
import {fastifyLogger} from '../logger';
import registerHooks from './hooks';
import registerPlugins from './plugins';
import * as routes from './routes';
import addSchemas from './schemas';

const fastify = createServer({
	maxParamLength: 1024,
	// Migrations are applied when running in Heroku which can take a while
	pluginTimeout: heroku ? convert(30).from('s').to('ms') : undefined
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
