import type {Prisma} from '@prisma/client';
import PrismaPackage from '@prisma/client';
import * as Sentry from '@sentry/node';

import {dbLogger} from './logger.js';
import {SentryBreadcrumbCategory} from './utils/enums.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
const {PrismaClient} = PrismaPackage;

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
		category: SentryBreadcrumbCategory.Database,
		message: info.message,
		level: Sentry.Severity.Info,
	});
	dbLogger.info(info.message);
});

db.$on('warn', warning => {
	Sentry.addBreadcrumb({
		category: SentryBreadcrumbCategory.Database,
		message: warning.message,
		level: Sentry.Severity.Warning,
	});
	dbLogger.warn(warning.message);
});

export default db;
