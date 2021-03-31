import consola, {ConsolaOptions, LogLevel} from 'consola';

const consolaOptions: ConsolaOptions = {
	level: LogLevel.Debug
};

const baseLogger = consola.create(consolaOptions);

export default baseLogger;

export const fastifyLogger = baseLogger.withTag('http');
export const configLogger = baseLogger.withTag('config');
export const dbLogger = baseLogger.withTag('db');
