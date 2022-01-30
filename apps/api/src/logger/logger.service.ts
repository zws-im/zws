import type {LoggerService} from '@nestjs/common';
import {Injectable} from '@nestjs/common';
import type {ConsolaOptions, Consola} from 'consola';
import consola, {BasicReporter, LogLevel} from 'consola';
import {AppConfigService} from '../app.config';
import {Env} from '../enums/env.enum';

@Injectable()
export class Logger {
	private readonly consolaOptions: ConsolaOptions;

	constructor(config: AppConfigService) {
		this.consolaOptions = {
			level: LogLevel.Debug,
		};

		if (config.env === Env.Production) {
			this.consolaOptions.reporters = [new BasicReporter()];
		}
	}

	createLogger(): Consola & LoggerService {
		return consola.create(this.consolaOptions);
	}
}
