import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { OpenapiTag } from './openapi/openapi-tag.enum';
import { TrpcService } from './trpc/trpc.service';

const app = await NestFactory.create(AppModule, {
	abortOnError: process.env['NODE_ENV'] !== 'development',
	cors: true,
});

const trpcService = app.get(TrpcService);

trpcService.register(app);

const openApiConfig = new DocumentBuilder()
	.setTitle('Zero Width Shortener')
	.setOpenAPIVersion('3.1.1')
	.setDescription('A URL shortener that uses zero width characters to shorten URLs.')
	.setVersion('2.0.0')
	.addServer('https://zws.im/api')
	.setContact('Jonah Snider', 'https://jonahsnider.com', 'jonah@jonahsnider.com')
	.setLicense('Apache 2.0', 'https://www.apache.org/licenses/LICENSE-2.0.html');

for (const tag of Object.values(OpenapiTag)) {
	openApiConfig.addTag(tag);
}
const openApiDoc = SwaggerModule.createDocument(
	app,

	openApiConfig.build(),
);

SwaggerModule.setup('api', app, cleanupOpenApiDoc(openApiDoc), {
	jsonDocumentUrl: '/openapi.json',
	yamlDocumentUrl: '/openapi.yaml',
	ui: false,
});

const configService = app.get(ConfigService);

await app.listen(configService.port);
