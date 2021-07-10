import {Prisma, PrismaClient} from '@prisma/client';
import * as Sentry from '@sentry/node';
import {dbLogger} from './logger';
import {sentry} from './config';

const db = new PrismaClient({
	log: [
		{emit: 'event', level: 'error'},
		{emit: 'event', level: 'info'},
		{emit: 'event', level: 'warn'},
	],
});

class PrismaError extends Error {}

function prismaLogEventToError(event: Prisma.LogEvent): PrismaError {
	if (event.target === undefined) {
		// See https://github.com/prisma/prisma/issues/6353
		dbLogger.warn('Prisma.LogEvent.target was undefined');

		return new PrismaError(event.message);
	}

	return new PrismaError(`${event.target}: ${event.message}`);
}

db.$on('error', error => {
	Sentry.captureException(prismaLogEventToError(error));
	dbLogger.error(error.message);
});

db.$on('info', info => {
	Sentry.addBreadcrumb({
		category: sentry.BreadcrumbCategory.Database,
		message: info.message,
		level: Sentry.Severity.Info,
	});
	dbLogger.info(info.message);
});

db.$on('warn', warning => {
	Sentry.addBreadcrumb({
		category: sentry.BreadcrumbCategory.Database,
		message: warning.message,
		level: Sentry.Severity.Warning,
	});
	dbLogger.warn(warning.message);
});

export default db;
