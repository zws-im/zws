import type {OnModuleInit} from '@nestjs/common';
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {z} from 'zod';
import {AppConfig} from '../app-config/app.config';
import type {EnvironmentVariables} from '../interfaces/config.interface';
import type {Logger} from '../logger/interfaces/logger.interface';
import {LoggerService} from '../logger/logger.service';
import type {Credentials} from './interfaces/credentials.interface';

@Injectable()
export class GoogleCloudConfig implements OnModuleInit {
	get service(): string {
		return 'zws';
	}

	readonly version: string;
	readonly credentials: Readonly<Credentials> | undefined;

	private readonly logger: Logger;

	constructor(private readonly configService: ConfigService<EnvironmentVariables>, private readonly appConfig: AppConfig, loggerService: LoggerService) {
		this.version = this.getVersion();
		this.credentials = this.getCredentials();

		this.logger = loggerService.createLogger().withTag('config').withTag('google-cloud');
	}

	onModuleInit() {
		this.logger.info('version:', this.version);
		this.logger.info('project ID:', this.credentials?.projectId);
		this.logger.info('key filename:', this.credentials?.keyFilename);
	}

	private getVersion(): string {
		return this.appConfig.version;
	}

	private getCredentials(): Credentials | undefined {
		const unvalidatedCredentials = {
			projectId: this.getProjectId(),
			keyFilename: this.getKeyFilename(),
		};

		const schema = z
			.object({
				projectId: z.string(),
				keyFilename: z.string(),
			})
			.or(
				z
					.object({
						projectId: z.undefined(),
						keyFilename: z.undefined(),
					})
					.transform(() => undefined),
			);

		const validatedCredentials = schema.parse(unvalidatedCredentials);

		return validatedCredentials;
	}

	private getProjectId(): string | undefined {
		return this.configService.get('GOOGLE_PROJECT_ID');
	}

	private getKeyFilename(): string | undefined {
		return this.configService.get('GOOGLE_APPLICATION_CREDENTIALS');
	}
}
