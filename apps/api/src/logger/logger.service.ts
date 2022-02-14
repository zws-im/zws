import {Injectable} from '@nestjs/common';
import type {ConsolaOptions} from 'consola';
import consola, {BasicReporter, LogLevel} from 'consola';
import {AppConfig} from '../app-config/app.config';
import {Env} from '../enums/env.enum';
import type {Logger} from './interfaces/logger.interface';

@Injectable()
export class LoggerService {
	private readonly consolaOptions: ConsolaOptions;

	constructor(config: AppConfig) {
		this.consolaOptions = {
			level: LogLevel.Verbose,
		};

		if (config.env === Env.Production) {
			this.consolaOptions.reporters = [new BasicReporter()];
		}
	}

	createLogger(): Logger {
		return consola.create(this.consolaOptions);
	}
}
