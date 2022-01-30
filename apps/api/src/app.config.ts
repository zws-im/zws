import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import type {EnvironmentVariables} from './interfaces/config.interface';
import {Env} from './enums/env.enum';

@Injectable()
export class AppConfigService {
	readonly port: number;
	readonly apiKey: string | undefined;
	readonly hostname: string | undefined;
	readonly sentryDsn: string | undefined;
	readonly env: Env;

	constructor(private readonly configService: ConfigService<EnvironmentVariables>) {
		this.port = this.getPort();
		this.apiKey = this.getApiKey();
		this.hostname = this.getHostname();
		this.sentryDsn = this.getSentryDsn();
		this.env = this.getEnv();
	}

	private getPort(): number {
		return this.configService.get('PORT') ?? 3000;
	}

	private getApiKey(): string | undefined {
		return this.configService.get('API_KEY');
	}

	private getHostname(): string | undefined {
		return this.configService.get('HOSTNAME');
	}

	private getSentryDsn(): string | undefined {
		return this.configService.get('SENTRY_DSN');
	}

	private getEnv(): Env {
		const raw = this.configService.get<string>('NODE_ENV');

		switch (raw) {
			case Env.Development:
				return Env.Development;
			case Env.Test:
				return Env.Test;
			default:
				return Env.Production;
		}
	}
}
