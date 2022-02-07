import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {APP_FILTER, APP_INTERCEPTOR} from '@nestjs/core';
import {AppConfigModule} from '../app-config/app-config.module';
import {LoggerModule} from '../logger/logger.module';
import {SentryConfig} from './sentry.config';
import {SentryFilter} from './sentry.filter';
import {SentryInterceptor} from './sentry.interceptor';
import {SentryService} from './sentry.service';

@Module({
	imports: [ConfigModule, AppConfigModule, LoggerModule],
	providers: [
		SentryConfig,
		SentryService,
		SentryService.sentryProvider,
		SentryInterceptor,
		SentryFilter,
		{
			provide: APP_INTERCEPTOR,
			useClass: SentryInterceptor,
		},
		{
			provide: APP_FILTER,
			useClass: SentryFilter,
		},
	],
	exports: [SentryInterceptor],
})
export class SentryModule {}
