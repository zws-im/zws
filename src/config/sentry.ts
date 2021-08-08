import process from 'process';
import {z} from 'zod';

const dsnSchema = z.string().nullable().optional().default(null);
export const dsn = dsnSchema.parse(process.env.SENTRY_DSN);

export enum BreadcrumbCategory {
	Database = 'db',
	Request = 'request',
}
