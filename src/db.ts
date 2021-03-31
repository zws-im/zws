import {PrismaClient} from '@prisma/client';
import {dbLogger} from './logger';
import * as Sentry from '@sentry/node';
import {sentry} from './config';

const db = new PrismaClient({
	log: [
		{emit: 'event', level: 'error'},
		{emit: 'event', level: 'info'},
		{emit: 'event', level: 'warn'}
	]
});

db.$on('error', error => {
	Sentry.captureException(error);
	dbLogger.error(error.message);
});

db.$on('info', info => {
	Sentry.addBreadcrumb({
		category: sentry.BreadcrumbCategory.Database,
		message: info.message,
		level: Sentry.Severity.Info
	});
	dbLogger.info(info.message);
});

db.$on('warn', warning => {
	Sentry.addBreadcrumb({
		category: sentry.BreadcrumbCategory.Database,
		message: warning.message,
		level: Sentry.Severity.Warning
	});
	dbLogger.warn(warning.message);
});

export default db;
