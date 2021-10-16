import process from 'node:process';
import * as Sentry from '@sentry/node';
import type {FastifyInstance} from 'fastify';
import {env, sentry, server} from '../config';
import db from '../db';
import {dbLogger, fastifyLogger as baseFastifyLogger} from '../logger';
import {stats} from './components/services';

const baseRequestLogger = baseFastifyLogger.withTag('request');

export default function addHooks(fastify: FastifyInstance): void {
	fastify.ready(async error => {
		if (error) {
			throw error;
		}

		try {
			fastify.swagger();
		} catch (error: unknown) {
			baseFastifyLogger.error('Fastify error', error);
		}

		if (env.env === env.Env.Dev) {
			const routeLogger = baseFastifyLogger.withTag('routes');

			const routes = fastify.printRoutes().trim().split('\n');

			for (const route of routes) {
				routeLogger.debug(route);
			}
		}

		try {
			await db.$connect();
		} catch (error: unknown) {
			dbLogger.fatal('Failed to connect to database', error);
			Sentry.captureException(error);

			process.exit(1);
		}

		// Periodically update stats with the precise counts
		await stats.savePreciseInstanceStats();
	});

	fastify.addHook('onClose', async () => db.$disconnect());

	fastify.addHook('onRequest', async request => {
		if (request.is404) {
			return;
		}

		const fastifyLogger = baseRequestLogger.withTag(request.id as string);

		const requestName = `${request.routerMethod} ${request.routerPath}`;

		const requestContext = {
			body: request.body,
			params: request.params,
			query: request.query,
		};

		Sentry.addBreadcrumb({
			category: sentry.BreadcrumbCategory.Request,
			message: requestName,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			data: {...requestContext, request_id: request.id as string},
		});

		Sentry.configureScope(scope => {
			scope.setTransactionName(requestName);

			scope.setContext('request', requestContext);
		});

		fastifyLogger.info(requestName, requestContext);
	});

	fastify.addHook('onSend', async (request, reply) => {
		void reply.header('Server', server.serverString);
	});

	fastify.addHook('onError', async (request, reply, error) => {
		if (reply.statusCode >= 500 && reply.statusCode < 600) {
			const fastifyLogger = baseFastifyLogger.withTag(request.id as string);

			fastifyLogger.error(error);
			// eslint-disable-next-line @typescript-eslint/naming-convention
			Sentry.captureException(error, {tags: {request_id: request.id as string}, user: {ip_address: '{{auto}}'}});
		}
	});
}
