import type {LoggerService as BaseLoggerService} from '@nestjs/common';
import {Injectable} from '@nestjs/common';
import type {Logger} from './interfaces/logger.interface';
import {LoggerService} from './logger.service';

@Injectable()
export class NestLogger implements BaseLoggerService {
	private readonly logger: Logger;

	constructor(loggerService: LoggerService) {
		this.logger = loggerService.createLogger().withTag('nest');
	}

	debug(...args: unknown[]) {
		const context = this.extractContext(args);

		if (context) {
			// @ts-expect-error Consola typings are bad
			this.logger.withTag(context).debug(...args.slice(0, -1));
		} else {
			// @ts-expect-error Consola typings are bad
			this.logger.debug(...args);
		}
	}

	error(...args: unknown[]) {
		const context = this.extractContext(args);

		if (context) {
			// @ts-expect-error Consola typings are bad
			this.logger.withTag(context).error(...args.slice(0, -1));
		} else {
			// @ts-expect-error Consola typings are bad
			this.logger.error(...args);
		}
	}

	warn(...args: unknown[]) {
		const context = this.extractContext(args);

		if (context) {
			// @ts-expect-error Consola typings are bad
			this.logger.withTag(context).warn(...args.slice(0, -1));
		} else {
			// @ts-expect-error Consola typings are bad
			this.logger.warn(...args);
		}
	}

	log(...args: unknown[]) {
		const context = this.extractContext(args);

		if (context) {
			// @ts-expect-error Consola typings are bad
			this.logger.withTag(context).log(...args.slice(0, -1));
		} else {
			// @ts-expect-error Consola typings are bad
			this.logger.log(...args);
		}
	}

	private extractContext(args: unknown[]): string | undefined {
		if (args.length > 0) {
			const maybeContext = args.at(-1);

			if (typeof maybeContext === 'string') {
				return maybeContext;
			}
		}

		return undefined;
	}
}
