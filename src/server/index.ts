import convert from 'convert';
import createServer from 'fastify';
import {heroku} from '../config/env';
import registerHooks from './hooks';
import * as routes from './routes';

const fastify = createServer({
	maxParamLength: 1024,
	// Migrations are applied when running in Heroku which can take a while
	pluginTimeout: heroku ? convert(30).from('s').to('ms') : undefined
});

registerHooks(fastify);

fastify.after(() => {
	for (const declareRoute of Object.values(routes)) {
		declareRoute(fastify);
	}
});

export default fastify;
