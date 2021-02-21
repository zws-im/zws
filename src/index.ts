import {server} from './config';
import fastify from './server';
import baseLogger from './logger';

const logger = baseLogger.getChildLogger({name: 'http'});

(async () => {
	try {
		const address = await fastify.listen({port: server.port, host: '0.0.0.0'});

		logger.info(`Listening at ${address}`);
	} catch (error: unknown) {
		logger.error(error);
		throw error;
	}
})().catch(error => {
	process.nextTick(() => {
		throw error;
	});
});
