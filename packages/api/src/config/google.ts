import process from 'node:process';
import {z} from 'zod';

const appCredentialsSchema = z.string().nullable().optional().default(null);

const projectIdSchema = z.string().nullable().optional().default(null);

export default function parse(processEnv: NodeJS.ProcessEnv) {
	const appCredentials = appCredentialsSchema.parse(processEnv.GOOGLE_APPLICATION_CREDENTIALS);
	const projectId = projectIdSchema.parse(process.env.GOOGLE_PROJECT_ID);

	return {appCredentials, projectId};
}
