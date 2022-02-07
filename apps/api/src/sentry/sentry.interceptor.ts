import type {CallHandler, ExecutionContext, NestInterceptor} from '@nestjs/common';
import {Injectable} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import type {Observable} from 'rxjs';
import type {UnsafeRequest} from '../interfaces/unsafe-request.interface';

@Injectable()
export class SentryInterceptor implements NestInterceptor<unknown, unknown> {
	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const request = context.switchToHttp().getRequest<UnsafeRequest>();

		const transactionName = `${request.method} ${String(request.route.path)}`;

		const requestContext = {
			body: request.body,
			params: request.params,
			query: request.query,
		};

		Sentry.configureScope(scope => {
			scope.setTransactionName(transactionName);

			scope.setContext('request', requestContext);

			// eslint-disable-next-line @typescript-eslint/naming-convention
			scope.setUser({ip_address: '{{auto}}'});
		});

		return next.handle();
	}
}
