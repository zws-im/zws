import {NestFactory} from '@nestjs/core';
import {SwaggerModule} from '@nestjs/swagger';
import {AppConfig} from './app-config/app.config';
import {AppModule} from './app.module';
import {NestLogger} from './logger/nest-logger.service';
import {OpenApiService} from './openapi/openapi.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		// Buffered logs will defer logging until the custom logger is initialized
		// This prevents the default Nest logger from being used for the first part of bootstrapping
		bufferLogs: true,
	});

	const nestLogger = app.get(NestLogger);
	app.useLogger(nestLogger);

	const openApiService = app.get(OpenApiService);
	const openApiConfig = openApiService.getConfig();
	const openApiDocument = SwaggerModule.createDocument(app, openApiConfig, {
		operationIdFactory: OpenApiService.operationIdFactory,
	});
	SwaggerModule.setup('docs/api', app, openApiDocument);

	const config = app.get(AppConfig);
	await app.listen(config.port);
}

void bootstrap();
