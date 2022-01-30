// @ts-check

const base = require('@jonahsnider/xo-config');

const config = {...base};

config.overrides.push({
	files: './{src,test}/**/*.ts',
	rules: {
		'new-cap': 'off',
		'import/extensions': ['error', 'never'],
	},
});

config.rules['unicorn/no-process-exit'] = 'off';
config.rules['@typescript-eslint/no-redeclare'] = 'off';

module.exports = config;
