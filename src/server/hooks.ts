import {FastifyInstance} from 'fastify';
import db from '../db';
import baseLogger from '../logger';

let requestId: string | undefined;

const fastifyLogger = baseLogger.getChildLogger({
	name: 'http',
	requestId: () => requestId!
});

export default function addHooks(fastify: FastifyInstance): void {
	fastify.addHook('onReady', async () => db.$connect());

	fastify.addHook('onClose', async () => db.$disconnect());

	fastify.addHook('onRequest', async (request, reply) => {
		requestId = request.id;

		fastifyLogger.info(`${request.routerMethod} ${request.routerPath}`);
	});

	fastify.addHook('onError', async (request, reply, error) => {
		if (reply.statusCode >= 500 && reply.statusCode < 600) {
			requestId = request.id;

			fastifyLogger.error(error);
		}
	});
}
