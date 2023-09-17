import { OpenAPIRegistry, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { oas31 } from 'openapi3-ts';
import * as allRoutes from '../../all-openapi';
import { openapi } from '../../stats/shields/version/openapi';
import { ConfigService, configService } from '../config/config.service';
import { OpenapiTag } from './enums/openapi-tag.enum';

// biome-ignore lint/nursery/noConfusingVoidType: This is a return type
type RegisterOpenapiFn = (oas: OpenapiService) => void;

export class OpenapiService {
	/**
	 * OpenAPI information is lazily loaded like this to minimize cold start time.
	 */
	private static loadOpenapi(): RegisterOpenapiFn[] {
		return Object.values(allRoutes)
			.filter((route): route is Extract<typeof route, { openapi: RegisterOpenapiFn }> => 'openapi' in route)
			.map((route) => route.openapi);
	}

	private readonly registry = new OpenAPIRegistry();
	private readonly generator: OpenApiGeneratorV31;

	constructor(private readonly configService: ConfigService) {
		openapi(this);

		for (const route of OpenapiService.loadOpenapi()) {
			route(this);
		}

		this.generator = new OpenApiGeneratorV31(this.registry.definitions);
	}

	getOpenapi(): oas31.OpenAPIObject {
		return this.generator.generateDocument({
			openapi: '3.1.0',
			info: {
				title: 'Zero Width Shortener',
				description: 'A URL shortener that uses zero width characters to shorten URLs.',
				version: '2.0.0',
				contact: {
					email: 'jonah@jonahsnider.com',
				},
				license: {
					name: 'Apache 2.0',
					url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
				},
			},
			servers: [
				{
					url: new URL('api', this.configService.shortenedBaseUrl ?? 'https://zws.im').toString(),
				},
			],
			tags: Object.values(OpenapiTag).map((tag) => ({ name: tag })),
		});
	}

	addPath(...parameters: Parameters<OpenAPIRegistry['registerPath']>): void {
		this.registry.registerPath(...parameters);
	}
}

export const openapiService = new OpenapiService(configService);
