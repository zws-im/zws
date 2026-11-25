import type { Config } from 'drizzle-kit';
import { createPool } from 'drizzle-orm/postgres';
import { cleanEnv, str } from 'envalid';

const env = cleanEnv(process.env, {
	DATABASE_URL: str({ desc: 'PostgreSQL URL' }),
});

export default {
	schema: 'apps/api/src/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		client: createPool({ url: env.DATABASE_URL, max: 1 }),
	},
	out: 'drizzle',
} satisfies Config;
