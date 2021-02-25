import {FastifyDynamicSwaggerOptions} from 'fastify-swagger';
import {author} from '../../package.json';
import {server} from '../config';

const openapi: FastifyDynamicSwaggerOptions['openapi'] = {
	openapi: '3.0.3',
	tags: [
		{name: 'urls', description: 'Shortened URLs'},
		{name: 'stats', description: 'Usage statistics'},
		{name: 'shields', description: 'Shields endpoint badges'}
	],
	info: {
		title: 'Zero Width Shortener',
		version: server.version,
		description: 'Shorten URLs with invisible spaces.',
		license: {name: 'Apache 2.0', url: 'https://www.apache.org/licenses/LICENSE-2.0.html'},
		contact: author
	},
	servers: [{url: 'https://api.zws.im', description: 'Production'}],
	components: {
		securitySchemes: {'API key': {type: 'http', scheme: 'bearer'}},
		responses: {
			ShieldsEndpointResponse: {
				description: 'Shields endpoint response',
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								schemaVersion: {type: 'integer', enum: [1], readOnly: true},
								label: {type: 'string', readOnly: true},
								message: {},
								color: {type: 'string', readOnly: true}
							},
							required: ['schemaVersion', 'label', 'message', 'color']
						}
					}
				}
			}
		}
	}
};

export default openapi;
