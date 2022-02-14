import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {AppConfig} from '../app-config/app.config';
import {Env} from '../enums/env.enum';
import type {EnvironmentVariables} from '../interfaces/config.interface';

@Injectable()
export class SentryConfig {
	readonly sentryDsn: string | undefined;
	readonly release: string | undefined;
	readonly environment: Env.Production | Env.Development | undefined;

	constructor(private readonly configService: ConfigService<EnvironmentVariables>, private readonly appConfig: AppConfig) {
		this.sentryDsn = this.getSentryDsn();
		this.release = this.getRelease();
		this.environment = this.getEnvironment();
	}

	private getSentryDsn(): string | undefined {
		return this.configService.get('SENTRY_DSN');
	}

	private getRelease(): string | undefined {
		if (this.appConfig.env === Env.Production) {
			return `zws-${this.appConfig.version}`;
		}
	}

	private getEnvironment(): Env.Production | Env.Development | undefined {
		if (this.appConfig.env !== Env.Test) {
			return this.appConfig.env;
		}
	}
}
