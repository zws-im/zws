import type { Config } from 'drizzle-kit';
import { cleanEnv, str } from 'envalid';

const env = cleanEnv(process.env, {
	DATABASE_URL: str({ desc: 'PostgreSQL URL' }),
});

export default {
	schema: 'apps/api/src/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	out: 'drizzle',
} satisfies Config;
