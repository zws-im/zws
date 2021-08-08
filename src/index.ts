import process from 'process';
import * as Sentry from '@sentry/node';
import {sentry, server, env} from './config';
import fastify from './server';
import {fastifyLogger} from './logger';

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
		release: env.env === env.Env.Dev ? undefined : `zws-${server.version}`,
	});
}

async function main() {
	try {
		const address = await fastify.listen({port: server.port, host: '0.0.0.0'});

		fastifyLogger.info(`Listening at ${address}`);
	} catch (error: unknown) {
		fastifyLogger.error(error);
		throw error;
	}
}

main().catch(error => {
	process.nextTick(() => {
		throw error;
	});
});
