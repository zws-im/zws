import type {ConsolaOptions} from 'consola';
import {BasicReporter, LogLevel} from 'consola';
import * as env from './env';

export const consolaOptions: ConsolaOptions = {
	level: LogLevel.Debug,
};

if (env.env === env.Env.Prod) {
	consolaOptions.reporters = [new BasicReporter()];
}
