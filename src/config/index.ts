import * as dotenv from 'dotenv';
import {configLogger} from '../logger.js';
import * as env from './env.js';

if (env.env === env.Env.Dev) {
	dotenv.config();
}

// `import` function is used to avoid Node.js running import/export syntax before the file runs (meaning process.env is not populated from dotenv)
/* eslint-disable node/no-unsupported-features/es-syntax */
const characters = await import('./characters.js');
const server = await import('./server.js');
const sentry = await import('./sentry.js');
const google = await import('./google.js');
const logger = await import('./logger.js');
const blocklist = await import('./blocklist.js');
/* eslint-enable node/no-unsupported-features/es-syntax */

configLogger.debug('characters', {characters: characters.characters, length: characters.length, rewrites: characters.rewrites});
configLogger.debug('env', env.Env[env.env]);

export {characters, env, server, sentry, google, logger, blocklist};
