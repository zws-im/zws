import { type INestApplication, Injectable } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { OpenapiTag } from './openapi-tag.enum';

@Injectable()
export class OpenapiService {
	private spec: OpenAPIObject | undefined;

	private createDocument(): DocumentBuilder {
		const config = new DocumentBuilder()
			.setTitle('Zero Width Shortener')
			.setDescription('A URL shortener that uses zero width characters to shorten URLs.')
			.setVersion('2.0.0')
			.addServer('https://zws.im/api')
			.setContact('Jonah Snider', 'https://jonahsnider.com', 'jonah@jonahsnider.com')
			.setLicense('Apache 2.0', 'https://www.apache.org/licenses/LICENSE-2.0.html');

		for (const tag of Object.values(OpenapiTag)) {
			config.addTag(tag);
		}

		return config;
	}

	createSpec(app: INestApplication): OpenAPIObject {
		const spec = SwaggerModule.createDocument(app, this.createDocument().build());

		this.spec = spec;

		return spec;
	}

	public getSpec(): OpenAPIObject | undefined {
		return this.spec;
	}
}
