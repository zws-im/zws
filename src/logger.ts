import type {ConsolaOptions} from 'consola';
import consolaPkg from 'consola';
import {Env} from './utils/enums.js';
import * as config from './config/index.js';

// Consola doesn't have ESM support
// eslint-disable-next-line @typescript-eslint/consistent-type-imports, @typescript-eslint/naming-convention
const {BasicReporter, LogLevel} = consolaPkg as unknown as typeof import('consola');

const consolaOptions: ConsolaOptions = {
	level: LogLevel.Debug,
};

if (config.env.env === Env.Prod) {
	consolaOptions.reporters = [new BasicReporter()];
}

const baseLogger = consolaPkg.create(consolaOptions);

export default baseLogger;

export const fastifyLogger = baseLogger.withTag('http');
export const configLogger = baseLogger.withTag('config');
export const dbLogger = baseLogger.withTag('db');
