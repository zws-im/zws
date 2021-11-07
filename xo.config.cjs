// @ts-check

const base = require('@jonahsnider/xo-config');

const config = {...base};

config.overrides.push(
	{
		files: './packages/schemas/src/**/*.ts',
		rules: {
			'new-cap': 'off',
			'unicorn/filename-case': 'off',
		},
	},
	{
		files: './packages/api/src/server/**/*.ts',
		rules: {
			'new-cap': 'off',
		},
	},
);

config.rules['unicorn/no-process-exit'] = 'off';
config.rules['@typescript-eslint/no-redeclare'] = 'off';

module.exports = config;
