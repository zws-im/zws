import {z} from 'zod';

const dsnSchema = z.string().nullable().optional().default(null);

export default function parse(processEnv: NodeJS.ProcessEnv) {
	const dsn = dsnSchema.parse(processEnv.SENTRY_DSN);

	return {dsn};
}
