import type {ArgumentsHost} from '@nestjs/common';
import {Catch} from '@nestjs/common';
import {BaseExceptionFilter} from '@nestjs/core';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryFilter extends BaseExceptionFilter {
	constructor() {
		super();
	}

	catch(exception: unknown, host: ArgumentsHost): void {
		Sentry.captureException(exception);

		super.catch(exception, host);
	}
}
