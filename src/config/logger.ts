import {BasicReporter, ConsolaOptions, LogLevel} from 'consola';
import * as env from './env';

export const consolaOptions: ConsolaOptions = {
	level: LogLevel.Debug,
};

if (env.env === env.Env.Prod) {
	consolaOptions.reporters = [new BasicReporter()];
}
