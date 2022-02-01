import {HttpStatus, ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {paramCase} from 'change-case';
import pkg from '../package.json';
import {AppConfigService} from './app.config';
import {AppModule} from './app.module';
import {AuthGuard} from './auth/auth.guard';
import {HttpExceptionFilter} from './filters/http-exception.filter';
import {NestLogger} from './logger/nest-logger.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		// Buffered logs will defer logging until the custom logger is initialized
		// This prevents the default Nest logger from being used for the first part of bootstrapping
		bufferLogs: true,
	});

	const nestLogger = app.get(NestLogger);
	app.useLogger(nestLogger);

	const config = app.get(AppConfigService);

	const openApiConfig = new DocumentBuilder()
		.setTitle('Zero Width Shortener')
		.setVersion(pkg.version)
		.setDescription('Shorten URLs with invisible spaces.')
		.setContact(pkg.author.name, pkg.author.url, pkg.author.email)
		.setLicense('Apache 2.0', 'https://www.apache.org/licenses/LICENSE-2.0.html')

		.addBearerAuth({type: 'http'})

		.addServer('http://{host}/{basePath}', 'Custom server (HTTP)', {
			host: {default: config.hostname === undefined ? `localhost:${config.port}` : config.hostname},
			basePath: {default: ''},
		})
		.addServer('https://{host}/{basePath}', 'Custom server (HTTPS)', {
			host: {default: config.hostname === undefined ? `localhost:${config.port}` : config.hostname},
			basePath: {default: ''},
		})
		.addServer('https://api.zws.im', 'zws.im production')

		.addTag('urls', 'Shortened URLs')
		.addTag('stats', 'Usage statistics')
		.addTag('shields', 'Shields endpoint badges')
		.addTag('health', 'Health checks')
		.build();
	const openApiDocument = SwaggerModule.createDocument(app, openApiConfig, {
		operationIdFactory: (controllerKey, methodKey) => `${paramCase(controllerKey.replace(/Controller$/, ''))}-${paramCase(methodKey)}`,
	});
	SwaggerModule.setup('docs/api', app, openApiDocument);

	app.useGlobalGuards(app.get(AuthGuard));
	app.useGlobalFilters(new HttpExceptionFilter());
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,

			errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,

			whitelist: true,
			forbidNonWhitelisted: true,
			forbidUnknownValues: true,
		}),
	);

	await app.listen(config.port);
}

void bootstrap();
