import process from 'node:process';
import * as dotenv from 'dotenv';
import {Env} from '../utils.js';
import parseBlocklist from './blocklist.js';
import parseCharacters from './characters.js';
import parseEnv from './env.js';
import parseGoogle from './google.js';
import parseSentry from './sentry.js';
import parseServer from './server.js';

export const env = parseEnv(process.env);

if (env.env === Env.Dev) {
	dotenv.config();
}

export const blocklist = parseBlocklist(process.env);
export const characters = parseCharacters(process.env);
export const google = parseGoogle(process.env);
export const sentry = parseSentry(process.env);
export const server = parseServer(process.env);
