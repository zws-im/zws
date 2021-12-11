// @ts-check

const base = require('@jonahsnider/xo-config');

const config = {...base};

config.overrides.push({
	files: './src/**/*.ts',
	rules: {
		'new-cap': 'off',
		'unicorn/filename-case': 'off',
	},
});

config.rules['@typescript-eslint/no-redeclare'] = 'off';

module.exports = config;
