// @ts-check

const base = require('@jonahsnider/xo-config');

const config = {...base};

config.overrides.push(
	{
		files: './{src,test}/**/*.ts',
		rules: {
			'new-cap': 'off',
			'import/extensions': ['error', 'never'],
		},
	},
	{
		files: './src/**/*.dto.ts',
		rules: {
			// If you don't explicitly set the type then it will not appear in the OpenAPI spec
			'@typescript-eslint/no-inferrable-types': 'off',
		},
	},
);

config.rules['unicorn/no-process-exit'] = 'off';
config.rules['@typescript-eslint/no-redeclare'] = 'off';

module.exports = config;
