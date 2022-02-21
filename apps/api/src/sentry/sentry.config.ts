import type {OnModuleInit} from '@nestjs/common';
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {AppConfig} from '../app-config/app.config';
import {Env} from '../enums/env.enum';
import type {EnvironmentVariables} from '../interfaces/config.interface';
import type {Logger} from '../logger/interfaces/logger.interface';
import {LoggerService} from '../logger/logger.service';

@Injectable()
export class SentryConfig implements OnModuleInit {
	readonly sentryDsn: string | undefined;
	readonly release: string | undefined;
	readonly environment: Env.Production | Env.Development | undefined;

	private readonly logger: Logger;

	constructor(private readonly configService: ConfigService<EnvironmentVariables>, private readonly appConfig: AppConfig, loggerService: LoggerService) {
		this.sentryDsn = this.getSentryDsn();
		this.release = this.getRelease();
		this.environment = this.getEnvironment();

		this.logger = loggerService.createLogger().withTag('config').withTag('sentry');
	}

	onModuleInit() {
		this.logger.info('Sentry DSN:', this.sentryDsn === undefined ? undefined : '(redacted)');
		this.logger.info('release:', this.release);
		this.logger.info('environment:', this.environment);
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
