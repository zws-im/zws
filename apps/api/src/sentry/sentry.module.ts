import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AppConfigModule} from '../app-config/app-config.module';
import {LoggerModule} from '../logger/logger.module';
import {SentryConfig} from './sentry.config';
import {SentryFilter} from './sentry.filter';
import {SentryInterceptor} from './sentry.interceptor';
import {SentryService} from './sentry.service';

@Module({
	imports: [ConfigModule, AppConfigModule, LoggerModule],
	providers: [SentryConfig, SentryService, SentryService.sentryProvider, SentryInterceptor, SentryFilter],
	exports: [SentryInterceptor, SentryFilter],
})
export class SentryModule {}
