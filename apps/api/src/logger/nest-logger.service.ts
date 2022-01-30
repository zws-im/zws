import type {LoggerService} from '@nestjs/common';
import {Injectable} from '@nestjs/common';
import type {Consola} from 'consola';
import {Logger} from './logger.service';

@Injectable()
export class NestLogger implements LoggerService {
	private readonly logger: Consola;

	constructor(loggerService: Logger) {
		this.logger = loggerService.createLogger().withTag('nest');
	}

	debug(...args: unknown[]) {
		const context = this.extractContext(args);

		if (context) {
			this.logger.debug(context, ...args.slice(0, -1));
		} else {
			// @ts-expect-error Consola typings are bad
			this.logger.debug(...args);
		}
	}

	error(...args: unknown[]) {
		const context = this.extractContext(args);

		if (context) {
			this.logger.error(context, ...args.slice(0, -1));
		} else {
			// @ts-expect-error Consola typings are bad
			this.logger.error(...args);
		}
	}

	warn(...args: unknown[]) {
		const context = this.extractContext(args);

		if (context) {
			this.logger.warn(context, ...args.slice(0, -1));
		} else {
			// @ts-expect-error Consola typings are bad
			this.logger.warn(...args);
		}
	}

	log(message: unknown, ...args: unknown[]) {
		const context = this.extractContext(args);

		if (context) {
			this.logger.withTag(context).log(message, ...args.slice(0, -1));
		} else {
			this.logger.log(message, ...args);
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
