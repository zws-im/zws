import process from 'process';
import profiler from '@google-cloud/profiler';
import * as Sentry from '@sentry/node';
import {env, google, sentry, server} from './config';
import baseLogger, {fastifyLogger} from './logger';
import fastify from './server';

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

if (google.appCredentials && google.projectId) {
	const logger = baseLogger.withTag('google').withTag('profiler');

	profiler
		.start({
			projectId: google.projectId,
			serviceContext: {
				service: 'zws',
				version: server.version,
			},
			keyFilename: google.appCredentials,
		})
		// eslint-disable-next-line promise/prefer-await-to-then
		.then(() => {
			logger.info('Started');
		})
		// eslint-disable-next-line promise/prefer-await-to-then
		.catch(error => {
			logger.error(error);
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
