import {server} from './config';
import fastify from './server';
import {fastifyLogger} from './logger';

(async () => {
	try {
		const address = await fastify.listen({port: server.port, host: '0.0.0.0'});

		fastifyLogger.info(`Listening at ${address}`);
	} catch (error: unknown) {
		fastifyLogger.error(error);
		throw error;
	}
})().catch(error => {
	process.nextTick(() => {
		throw error;
	});
});
