import type {FastifyDynamicSwaggerOptions} from 'fastify-swagger';
import pkg from '../../package.json';
import * as config from '../config/index.js';
import {OpenApiSecuritySchemeNames, OpenApiTags} from '../utils/enums.js';

const openapi: FastifyDynamicSwaggerOptions['openapi'] = {
	openapi: '3.0.3',
	tags: [
		{name: OpenApiTags.Urls, description: 'Shortened URLs'},
		{name: OpenApiTags.Stats, description: 'Usage statistics'},
		{name: OpenApiTags.Shields, description: 'Shields endpoint badges'},
		{name: OpenApiTags.Health, description: 'Health checks'},
	],
	info: {
		title: 'Zero Width Shortener',
		version: config.server.version,
		description: 'Shorten URLs with invisible spaces.',
		license: {name: 'Apache 2.0', url: 'https://www.apache.org/licenses/LICENSE-2.0.html'},
		contact: pkg.author,
	},
	servers: [
		{
			description: 'Custom server (HTTPS)',
			url: 'https://{host}/{basePath}',
			variables: {
				host: {default: config.server.hostname === null ? `localhost:${config.server.port}` : config.server.hostname},
				basePath: {default: ''},
			},
		},
		{
			description: 'Custom server (HTTP)',
			url: 'http://{host}/{basePath}',
			variables: {
				host: {default: config.server.hostname === null ? `localhost:${config.server.port}` : config.server.hostname},
				basePath: {default: ''},
			},
		},
		{url: 'https://api.zws.im', description: 'zws.im production'},
	],
};

if (config.server.apiKey !== null) {
	openapi.components = {
		securitySchemes: {[OpenApiSecuritySchemeNames.ApiKey]: {type: 'http', scheme: 'bearer'}},
	};
}

export default openapi;
