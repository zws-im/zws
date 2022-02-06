import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {AppConfig} from '../app-config/app.config';
import type {EnvironmentVariables} from '../interfaces/config.interface';

@Injectable()
export class SentryConfig {
	readonly sentryDsn: string | undefined;
	readonly release: string | undefined;
	readonly environment: string;

	constructor(private readonly configService: ConfigService<EnvironmentVariables>, appConfig: AppConfig) {
		this.sentryDsn = this.getSentryDsn();
		this.release = appConfig.env === 'production' ? `zws-${appConfig.version}` : undefined;
		this.environment = appConfig.env;
	}

	private getSentryDsn(): string | undefined {
		return this.configService.get('SENTRY_DSN');
	}
}
