import type {ConsolaOptions} from 'consola';
import consolaPkg from 'consola';
import * as env from './env.js';

// Consola doesn't have ESM support
// eslint-disable-next-line @typescript-eslint/consistent-type-imports, @typescript-eslint/naming-convention
const {BasicReporter, LogLevel} = consolaPkg as unknown as typeof import('consola');

export const consolaOptions: ConsolaOptions = {
	level: LogLevel.Debug,
};

if (env.env === env.Env.Prod) {
	consolaOptions.reporters = [new BasicReporter()];
}
