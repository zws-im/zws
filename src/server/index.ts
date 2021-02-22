import convert from 'convert';
import createServer, {RouteOptions} from 'fastify';
import {heroku} from '../config/env';
import {fastifyLogger} from '../logger';
import registerHooks from './hooks';
import * as routes from './routes';

const fastify = createServer({
	maxParamLength: 1024,
	// Migrations are applied when running in Heroku which can take a while
	pluginTimeout: heroku ? convert(30).from('s').to('ms') : undefined
});

registerHooks(fastify);

for (const route of Object.values(routes)) {
	fastify.route(route as RouteOptions);
}

export default fastify;
