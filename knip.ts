import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	entry: ['scripts/*.ts', 'umzug/migrator.ts', 'umzug/migrations/*.ts'],
	ignore: [
		'next-env.d.ts',
		//  The [TO_RESPONSE] method is required by an external library, we don't use it directly
		'app/api/_lib/exceptions/base.exception.ts',
	],
	ignoreBinaries: ['bunx', 'nixpacks'],
	ignoreDependencies: ['vercel', 'bun-types', '@tsconfig/bun', '@tsconfig/strictest'],
};

export default config;
