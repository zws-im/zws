export const dsn = process.env.SENTRY_DSN ?? null;

export enum BreadcrumbCategory {
	Database = 'db',
	Request = 'request'
}
