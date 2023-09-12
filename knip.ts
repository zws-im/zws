import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	entry: [
		'app/**/{page,layout,error,not-found}.tsx',
		'app/**/route.ts',
		'instrumentation.ts',
		'middleware.ts',
		'app/manifest.ts',
		'next.config.js',
		'next-env.d.ts',
		'scripts/*',
	],
	include: [],

	// Next.js plugin is bugged, see https://github.com/webpro/knip/issues/235
	next: false,

	ignore: [
		//  The [TO_RESPONSE] method is required by an external library, we don't use it directly
		'app/api/_lib/exceptions/base.exception.ts',
	],
	ignoreBinaries: ['bunx', 'nixpacks'],
	ignoreDependencies: ['vercel', 'bun-types', '@tsconfig/bun', '@tsconfig/strictest'],
};

export default config;
