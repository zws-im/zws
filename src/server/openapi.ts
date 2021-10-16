import type {FastifyDynamicSwaggerOptions} from 'fastify-swagger';
import pkg from '../../package.json';
import {server} from '../config/index.js';
import {SecuritySchemes, Tags} from '../config/server.js';

const openapi: FastifyDynamicSwaggerOptions['openapi'] = {
	openapi: '3.0.3',
	tags: [
		{name: Tags.Urls, description: 'Shortened URLs'},
		{name: Tags.Stats, description: 'Usage statistics'},
		{name: Tags.Shields, description: 'Shields endpoint badges'},
		{name: Tags.Health, description: 'Health checks'},
	],
	info: {
		title: 'Zero Width Shortener',
		version: server.version,
		description: 'Shorten URLs with invisible spaces.',
		license: {name: 'Apache 2.0', url: 'https://www.apache.org/licenses/LICENSE-2.0.html'},
		contact: pkg.author,
	},
	servers: [{url: 'https://api.zws.im', description: 'Production'}],
	components: {
		securitySchemes: {[SecuritySchemes.ApiKey]: {type: 'http', scheme: 'bearer'}},
	},
};

export default openapi;
