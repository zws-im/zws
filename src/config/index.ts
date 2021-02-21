import * as dotenv from 'dotenv';
import * as env from './env';

if (env.env === env.Env.Dev) {
	dotenv.config();
}

export * as characters from './characters';
export * as env from './env';
export * as server from './server';
