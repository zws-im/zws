import type {CallHandler, ExecutionContext, NestInterceptor} from '@nestjs/common';
import {Inject, Injectable} from '@nestjs/common';
import type {Observable} from 'rxjs';
import type {UnsafeRequest} from '../interfaces/unsafe-request.interface';
import {SentryNode, SentryService, SENTRY_PROVIDER} from './sentry.service';

@Injectable()
export class SentryInterceptor implements NestInterceptor<unknown, unknown> {
	constructor(@Inject(SENTRY_PROVIDER) private readonly Sentry: SentryNode) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const request = context.switchToHttp().getRequest<UnsafeRequest>();

		const transactionName = SentryService.getTransactionName(request);

		const requestContext = SentryService.getRequestContext(request);

		this.Sentry.configureScope(scope => {
			scope.setTransactionName(transactionName);

			scope.setContext('request', requestContext);

			// eslint-disable-next-line @typescript-eslint/naming-convention
			scope.setUser({ip_address: '{{auto}}'});
		});

		return next.handle();
	}
}
