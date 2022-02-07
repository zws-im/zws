import type {ExceptionFilter} from '@nestjs/common';
import {Catch} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import type {Logger} from '../logger/interfaces/logger.interface';
import {LoggerService} from '../logger/logger.service';

@Catch()
export class SentryFilter implements ExceptionFilter {
	logger: Logger;
	constructor(loggerService: LoggerService) {
		this.logger = loggerService.createLogger();
	}

	catch(exception: unknown): void {
		Sentry.captureException(exception);
	}
}
