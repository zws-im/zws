import type {OnModuleInit} from '@nestjs/common';
import {Injectable} from '@nestjs/common';
import {AppConfig} from './app-config/app.config';
import type {Logger} from './logger/interfaces/logger.interface';
import {LoggerService} from './logger/logger.service';

@Injectable()
export class AppService implements OnModuleInit {
	private readonly logger: Logger;

	constructor(private readonly config: AppConfig, logger: LoggerService) {
		this.logger = logger.createLogger().withTag('config').withTag('app');
	}

	onModuleInit() {
		this.logger.info('version:', this.config.version);
		this.logger.info('port:', this.config.port);
		this.logger.info('hostname:', this.config.hostname);
		this.logger.info('env:', this.config.env);
	}
}
