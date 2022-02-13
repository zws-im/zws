import type {ArgumentsHost} from '@nestjs/common';
import {Catch, Inject} from '@nestjs/common';
import {BaseExceptionFilter} from '@nestjs/core';
import {SentryNode, SENTRY_PROVIDER} from './sentry.service';

@Catch()
export class SentryFilter extends BaseExceptionFilter {
	constructor(@Inject(SENTRY_PROVIDER) private readonly Sentry: SentryNode) {
		super();
	}

	catch(exception: unknown, host: ArgumentsHost): void {
		this.Sentry.captureException(exception);

		super.catch(exception, host);
	}
}
