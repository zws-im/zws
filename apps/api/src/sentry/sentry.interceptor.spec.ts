import type {ExecutionContext} from '@nestjs/common';
import type {TestingModule} from '@nestjs/testing';
import {Test} from '@nestjs/testing';
import type {Scope} from '@sentry/types';
import {SentryInterceptor} from './sentry.interceptor';
import {SENTRY_PROVIDER} from './sentry.service';

type ScopeCallback = (scope: Scope) => void;

describe('SentryInterceptor', () => {
	describe('intercept', () => {
		it('should be defined', async () => {
			const mockSentry = {
				configureScope: jest.fn(),
			};

			const module: TestingModule = await Test.createTestingModule({
				providers: [
					SentryInterceptor,
					{
						provide: SENTRY_PROVIDER,
						useValue: mockSentry,
					},
				],
			}).compile();

			const interceptor = module.get<SentryInterceptor>(SentryInterceptor);

			const mockExecutionContext = {
				switchToHttp: jest.fn().mockReturnValue({
					getRequest: jest.fn().mockReturnValue({
						method: 'POST',
						route: {
							path: '/controller/route',
						},
						body: 'body',
						params: 'params',
						query: 'query',
					}),
				}),
			};
			const handleReturnValue = Symbol('next.handle() return value');
			expect(
				interceptor.intercept(mockExecutionContext as unknown as ExecutionContext, {
					handle: jest.fn().mockReturnValue(handleReturnValue),
				}),
			).toBe(handleReturnValue);

			expect(mockSentry.configureScope).toHaveBeenCalledTimes(1);

			const scopeCallback = mockSentry.configureScope.mock.calls[0][0] as ScopeCallback;

			const mockScope = {
				setTransactionName: jest.fn(),
				setContext: jest.fn(),
				setUser: jest.fn(),
			};
			scopeCallback(mockScope as unknown as Scope);

			expect(mockScope.setTransactionName).toHaveBeenCalledTimes(1);
			expect(mockScope.setTransactionName).toHaveBeenCalledWith('POST /controller/route');

			expect(mockScope.setContext).toHaveBeenCalledTimes(1);
			expect(mockScope.setContext).toHaveBeenCalledWith('request', {
				body: 'body',
				params: 'params',
				query: 'query',
			});

			expect(mockScope.setUser).toHaveBeenCalledTimes(1);
			expect(mockScope.setUser).toHaveBeenCalledWith({
				// eslint-disable-next-line @typescript-eslint/naming-convention
				ip_address: '{{auto}}',
			});
		});
	});
});
