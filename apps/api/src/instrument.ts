import * as Sentry from '@sentry/nestjs';

Sentry.init({
	dsn: process.env['SENTRY_DSN'],
	environment: process.env['NODE_ENV'],
});
