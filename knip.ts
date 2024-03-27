import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	entry: ['scripts/*.ts', 'umzug/migrator.ts', 'umzug/migrations/*.ts'],
	ignore: [
		'next-env.d.ts',
		//  The [TO_RESPONSE] method is required by an external library, we don't use it directly
		'app/api/_lib/exceptions/base.exception.ts',
	],
	ignoreBinaries: ['nixpacks'],
	ignoreDependencies: ['vercel', '@types/bun', '@tsconfig/bun', '@tsconfig/strictest'],
};

// biome-ignore lint/style/noDefaultExport: This must be a default export
export default config;
