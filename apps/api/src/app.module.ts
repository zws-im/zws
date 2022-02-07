import path from 'node:path';
import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {APP_FILTER, APP_GUARD, APP_INTERCEPTOR} from '@nestjs/core';
import {AppConfigModule} from './app-config/app-config.module';
import {AuthModule} from './auth/auth.module';
import {HttpExceptionFilter} from './filters/http-exception.filter';
import {HealthModule} from './health/health.module';
import {LoggerModule} from './logger/logger.module';
import {PrismaModule} from './prisma/prisma.module';
import {SentryModule} from './sentry/sentry.module';
import {ShieldsBadgesModule} from './shields-badges/shields-badges.module';
import {StatsModule} from './stats/stats.module';
import {UrlsModule} from './urls/urls.module';
import {GoogleCloudModule} from './google-cloud/google-cloud.module';
import {SentryInterceptor} from './sentry/sentry.interceptor';
import {SentryFilter} from './sentry/sentry.filter';
import {AuthGuard} from './auth/auth.guard';
import {OpenApiModule} from './openapi/openapi.module';

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
		{
			provide: APP_FILTER,
			useClass: SentryFilter,
		},

		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AppModule {}
