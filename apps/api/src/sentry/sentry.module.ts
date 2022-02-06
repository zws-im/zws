import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AppConfigModule} from '../app-config/app-config.module';
import {SentryConfig} from './sentry.config';
import {SentryService} from './sentry.service';

@Module({
	imports: [ConfigModule, AppConfigModule],
	providers: [SentryConfig, SentryService, SentryService.sentryProvider],
})
export class SentryModule {}
