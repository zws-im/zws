import createServer, {RouteOptions} from 'fastify';
import cors from 'fastify-cors';
import logger from '../logger';
import registerHooks from './hooks';
import * as routes from './routes';

const fastify = createServer({maxParamLength: 1024});

registerHooks(fastify);

for (const route of Object.values(routes)) {
	fastify.route(route as RouteOptions);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
fastify.register(cors).then(() => {}, logger.getChildLogger({name: 'http'}).error);

export default fastify;
