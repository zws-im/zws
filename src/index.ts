import process from 'node:process';
import * as profiler from '@google-cloud/profiler';
import * as Sentry from '@sentry/node';
import * as config from './config/index.js';
import baseLogger, {configLogger, fastifyLogger} from './logger.js';
import fastify from './server/index.js';
import {Env} from './utils/enums.js';

function logConfig() {
	baseLogger.info('ZWS API version', config.server.version);
	if (config.server.hostname) {
		configLogger.withTag('server').debug('hostname:', config.server.hostname?.toString());
	} else {
		configLogger.withTag('server').warn('no hostname set, clients will be able to create circular shortened URLs');
	}

	configLogger.withTag('server').debug('port:', config.server.port);
	configLogger.withTag('server').debug('API key', config.server.apiKey ? 'enabled' : 'not enabled');

	if (config.server.shortenedBaseUrl) {
		configLogger.withTag('server').debug('shortened base URL:', config.server.shortenedBaseUrl.toString());
	} else {
		configLogger.withTag('server').warn('no shortened base URL configured, clients will need to assemble shortened URLs themselves');
	}

	configLogger.withTag('env').info('running in', config.env.env);

	if (config.blocklist.blockedHostnames.size > 0) {
		configLogger.withTag('blocklist').debug('number of blocked hostnames:', config.blocklist.blockedHostnames.size);
	} else {
		configLogger.withTag('blocklist').debug('no blocked hostnames');
	}

	configLogger.withTag('characters').debug('characters', config.characters.characters);
	configLogger.withTag('characters').debug('length', config.characters.length);
	if (Object.keys(config.characters.rewrites).length > 0) {
		configLogger.withTag('characters').debug('rewrites', config.characters.rewrites);
	} else {
		configLogger.withTag('characters').debug('no rewrites');
	}

	configLogger.withTag('sentry').debug('DSN', config.sentry.dsn ? 'defined' : 'not defined');

	configLogger.withTag('google').debug('project ID', config.google.projectId);
	configLogger.withTag('google').debug('credentials', config.google.appCredentials ? 'defined' : 'not defined');
}

logConfig();

if (config.sentry.dsn) {
	let environment: 'production' | 'development' | undefined;

	switch (config.env.env) {
		case Env.Dev:
			environment = 'development';
			break;
		case Env.Prod:
			environment = 'production';
			break;
		default:
	}

	Sentry.init({
		dsn: config.sentry.dsn,
		environment,
		release: config.env.env === Env.Dev ? undefined : `zws-${config.server.version}`,
	});
}

if (config.google.appCredentials && config.google.projectId) {
	const logger = baseLogger.withTag('google').withTag('profiler');

	profiler
		.start({
			projectId: config.google.projectId,
			serviceContext: {
				service: 'zws',
				version: config.server.version,
			},
			keyFilename: config.google.appCredentials,
		})
		// eslint-disable-next-line promise/prefer-await-to-then
		.then(() => {
			logger.success('Started');
		})
		// eslint-disable-next-line promise/prefer-await-to-then
		.catch(error => {
			logger.error(error);
		});
}

try {
	const address = await fastify.listen({port: config.server.port, host: '0.0.0.0'});

	fastifyLogger.info(`Listening at ${address}`);
} catch (error: unknown) {
	fastifyLogger.error(error);
	throw error;
}
