import process from 'process';
import {z} from 'zod';

const appCredentialsSchema = z.string().nullable().optional().default(null);
export const appCredentials = appCredentialsSchema.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

const projectIdSchema = z.string().nullable().optional().default(null);
export const projectId = projectIdSchema.parse(process.env.GOOGLE_PROJECT_ID);
