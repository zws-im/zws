import type {OnModuleInit, Provider} from '@nestjs/common';
import {Inject, Injectable} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import type {Context} from '@sentry/types';
import type {UnsafeRequest} from '../interfaces/unsafe-request.interface';
import {SentryConfig} from './sentry.config';

export type SentryNode = typeof Sentry;

export const SENTRY_PROVIDER = Symbol('@sentry/node');

@Injectable()
export class SentryService implements OnModuleInit {
	static readonly sentryProvider: Provider<SentryNode> = {
		provide: SENTRY_PROVIDER,
		useValue: Sentry,
	};

	static getTransactionName(request: UnsafeRequest): string {
		return `${request.method} ${String(request.route.path)}`;
	}

	static getRequestContext(request: UnsafeRequest): Context {
		return {
			body: request.body,
			params: request.params,
			query: request.query,
		};
	}

	constructor(private readonly config: SentryConfig, @Inject(SENTRY_PROVIDER) public readonly Sentry: SentryNode) {}

	/**
	 * Initializes Sentry.
	 * @returns Whether Sentry was initialized
	 */
	onModuleInit(): boolean {
		if (!this.config.sentryDsn) {
			return false;
		}

		const options: Sentry.NodeOptions = {
			dsn: this.config.sentryDsn,
		};

		if (this.config.release) {
			options.release = this.config.release;
		}

		if (this.config.environment) {
			options.environment = this.config.environment;
		}

		this.Sentry.init(options);

		return true;
	}
}
