import consola from 'consola';
import * as logger from './config/logger';

const baseLogger = consola.create(logger.consolaOptions);

export default baseLogger;

export const fastifyLogger = baseLogger.withTag('http');
export const configLogger = baseLogger.withTag('config');
export const dbLogger = baseLogger.withTag('db');
