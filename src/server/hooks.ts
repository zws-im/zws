import {FastifyInstance} from 'fastify';
import {env} from '../config';
import db, {applyMigrations} from '../db';
import baseLogger from '../logger';

let requestId: string | undefined;

const fastifyLogger = baseLogger.getChildLogger({
	name: 'http',
	requestId: () => requestId!
});

export default function addHooks(fastify: FastifyInstance): void {
	fastify.addHook('onReady', async () => {
		if (env.heroku) {
			const dbLogger = baseLogger.getChildLogger({name: 'db'});

			dbLogger.info('Heroku environment detected, running migrations');

			try {
				await applyMigrations();
			} catch (error: unknown) {
				dbLogger.error('Migrations failed', error);
				throw error;
			}

			dbLogger.info('Migrations completed');
		}

		if (env.env === env.Env.Dev) {
			fastifyLogger.debug(fastify.printRoutes().trim().split('\n'));
		}

		await db.$connect();
	});

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
