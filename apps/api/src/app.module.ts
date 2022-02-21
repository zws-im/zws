import path from 'node:path';
import {HttpStatus, Module, ValidationPipe} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE} from '@nestjs/core';
import {AppConfigModule} from './app-config/app-config.module';
import {AppService} from './app.service';
import {AuthGuard} from './auth/auth.guard';
import {AuthModule} from './auth/auth.module';
import {HttpExceptionFilter} from './filters/http-exception.filter';
import {GoogleCloudModule} from './google-cloud/google-cloud.module';
import {HealthModule} from './health/health.module';
import {LoggerModule} from './logger/logger.module';
import {OpenApiModule} from './openapi/openapi.module';
import {PrismaModule} from './prisma/prisma.module';
import {SentryFilter} from './sentry/sentry.filter';
import {SentryInterceptor} from './sentry/sentry.interceptor';
import {SentryModule} from './sentry/sentry.module';
import {SentryService} from './sentry/sentry.service';
import {ShieldsBadgesModule} from './shields-badges/shields-badges.module';
import {StatsModule} from './stats/stats.module';
import {UrlsModule} from './urls/urls.module';

@Module({
	imports: [
		// Modules that should be run early as possible
		SentryModule,
		GoogleCloudModule,

		// Dynamic modules
		ConfigModule.forRoot({
			envFilePath: [
				/* eslint-disable unicorn/prefer-module */
				// .env relative to this source file
				path.join(__dirname, '..', '..', '.env'),
				// .env relative to this file compiled to dist/src/
				path.join(__dirname, '..', '..', '..', '..', '.env'),
				/* eslint-enable unicorn/prefer-module */
			],
		}),

		// Other modules
		AppConfigModule,
		LoggerModule,
		AuthModule,
		PrismaModule,
		OpenApiModule,

		// Modules with controllers
		HealthModule,
		StatsModule,
		ShieldsBadgesModule,
		// UrlsModule goes last since its controller has a /:id route which is rather broad
		UrlsModule,
	],
	providers: [
		HttpExceptionFilter,
		{
			provide: APP_INTERCEPTOR,
			useClass: SentryInterceptor,
		},

		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
		SentryService.sentryProvider,
		{
			provide: APP_FILTER,
			useClass: SentryFilter,
		},

		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},

		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({
				transform: true,

				errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,

				whitelist: true,
				forbidNonWhitelisted: true,
				forbidUnknownValues: true,
			}),
		},

		AppService,
	],
})
export class AppModule {}
