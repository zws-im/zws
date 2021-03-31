import * as Sentry from '@sentry/node';
import {FastifyInstance} from 'fastify';
import {env, sentry, server} from '../config';
import db from '../db';
import {dbLogger, fastifyLogger as baseFastifyLogger} from '../logger';

if (sentry.dsn) {
	let environment: 'production' | 'development' | undefined;

	switch (env.env) {
		case env.Env.Dev:
			environment = 'development';
			break;
		case env.Env.Prod:
			environment = 'production';
			break;
		default:
	}

	Sentry.init({
		dsn: sentry.dsn,
		environment,
		release: env.env === env.Env.Dev ? undefined : `zws-${server.version}`
	});
}

const baseRequestLogger = baseFastifyLogger.withTag('request')

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
	});

	fastify.addHook('onClose', async () => db.$disconnect());

	fastify.addHook('onRequest', async (request, reply) => {
		if (request.is404) {
			return;
		}

		const fastifyLogger = baseRequestLogger.withTag(request.id);

		const requestName = `${request.routerMethod} ${request.routerPath}`;

		const requestContext = {
			body: request.body,
			params: request.params,
			query: request.query
		};

		Sentry.addBreadcrumb({
			category: sentry.BreadcrumbCategory.Request,
			message: requestName,
			data: {...requestContext, request_id: request.id}
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
			const fastifyLogger = baseFastifyLogger.withTag(request.id);

			fastifyLogger.error(error);
			Sentry.captureException(error, {tags: {request_id: request.id}, user: {ip_address: '{{auto}}'}});
		}
	});
}
