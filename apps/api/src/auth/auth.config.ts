import type {OnModuleInit} from '@nestjs/common';
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import type {EnvironmentVariables} from '../interfaces/config.interface';
import type {Logger} from '../logger/interfaces/logger.interface';
import {LoggerService} from '../logger/logger.service';

@Injectable()
export class AuthConfig implements OnModuleInit {
	/**
	 * The API key for regular users.
	 * In the future an admin API key may also be configured, which is why there is a distinction.
	 */
	readonly userApiKey: string | undefined;

	private readonly logger: Logger;

	constructor(private readonly configService: ConfigService<EnvironmentVariables>, loggerService: LoggerService) {
		this.userApiKey = this.getUserApiKey();

		this.logger = loggerService.createLogger().withTag('config').withTag('auth');
	}

	onModuleInit() {
		this.logger.info('API key:', this.userApiKey === undefined ? undefined : '(redacted)');
	}

	private getUserApiKey(): string | undefined {
		return this.configService.get('API_KEY');
	}
}
