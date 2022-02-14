/* eslint-disable unicorn/prefer-module */

const path = require('path');

module.exports = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: '.',
	testEnvironment: 'node',
	testRegex: '.e2e-spec.ts$',
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	globals: {
		'ts-jest': {
			astTransformers: {
				before: [path.join(__dirname, 'nest-swagger-cli-plugin.js')],
			},
		},
	},
	setupFiles: ['./jest-dotenv.js'],
};
