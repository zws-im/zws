import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	workspaces: {
		'.': {
			// Local infrastructure is managed by mise rather than npm.
			ignoreBinaries: ['pitchfork'],
		},
		'apps/api': {
			entry: [
				// NestJS application entry point.
				'src/main.ts',

				// Vitest executes compiled JavaScript, so include the source tests explicitly.
				'tests/**/*.test.ts',

				// Maintenance script invoked by the block-malicious-url-entry skill.
				'scripts/*.ts',
			],
			// Portless wraps this command, which hides it from Knip's script parser.
			ignoreDependencies: ['tsx'],
			// Portless is installed globally for local development.
			ignoreBinaries: ['portless'],
		},
		'apps/web': {
			entry: [
				// Loaded by the OpenNext Cloudflare CLI.
				'open-next.config.ts',
			],
			project: ['**/*.{ts,tsx,js,css}'],
			// Portless is installed globally for local development.
			ignoreBinaries: ['portless'],
		},
	},
};

export default config;
