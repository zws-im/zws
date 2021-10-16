import * as dotenv from 'dotenv';
import {configLogger} from '../logger.js';
import * as env from './env.js';

if (env.env === env.Env.Dev) {
	dotenv.config();
}

// eslint-disable-next-line import/first
import * as characters from './characters.js';

configLogger.debug('characters', {characters: characters.characters, length: characters.length, rewrites: characters.rewrites});
configLogger.debug('env', env.Env[env.env]);

export * as characters from './characters.js';
export * as env from './env.js';
export * as server from './server.js';
export * as sentry from './sentry.js';
export * as google from './google.js';
export * as logger from './logger.js';
export * as blocklist from './blocklist.js';
