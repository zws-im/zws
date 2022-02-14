/* eslint-disable unicorn/prefer-module */

const transformer = require('@nestjs/swagger/plugin');

module.exports.name = 'nestjs-swagger-transformer';
// Remember to change the version number anytime you change the configuration below
// Jest will not detect changes otherwise
module.exports.version = 1;

module.exports.factory = cs => {
	return transformer.before(
		{
			// @nestjs/swagger/plugin options (can be empty)
		},
		cs.program,
	);
};
