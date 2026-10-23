import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		// Compile with tsc first to preserve Nest's decorator metadata.
		include: ['dist-test/tests/**/*.test.js'],
		globalSetup: ['./tests/global-setup.ts'],
		tags: [{ name: 'integration' }],
		sequence: { concurrent: true },
		testTimeout: 30_000,
		hookTimeout: 120_000,
	},
});
