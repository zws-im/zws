import type { Config } from 'drizzle-kit';
import { cleanEnv, str } from 'envalid';

const env = cleanEnv(process.env, {
	// biome-ignore lint/style/useNamingConvention: This is an environment variable
	DATABASE_URL: str({ desc: 'PostgreSQL URL' }),
});

// biome-ignore lint/style/noDefaultExport: This must be a default export
export default {
	schema: 'apps/api/src/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	out: 'drizzle',
} satisfies Config;
