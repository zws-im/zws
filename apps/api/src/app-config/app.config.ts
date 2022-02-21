import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import pkg from '../../package.json';
import {Env} from '../enums/env.enum';
import type {EnvironmentVariables} from '../interfaces/config.interface';

@Injectable()
export class AppConfig {
	readonly version = pkg.version;
	readonly port: number;
	readonly hostname: string | undefined;
	readonly env: Env;

	constructor(private readonly configService: ConfigService<EnvironmentVariables>) {
		this.port = this.getPort();
		this.hostname = this.getHostname();
		this.env = this.getEnv();
	}

	private getPort(): number {
		return this.configService.get('PORT') ?? 3000;
	}

	private getHostname(): string | undefined {
		return this.configService.get('HOSTNAME');
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
