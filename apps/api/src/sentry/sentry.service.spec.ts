import type {TestingModule} from '@nestjs/testing';
import {Test} from '@nestjs/testing';
import {SentryConfig} from './sentry.config';
import {SentryService, SENTRY_PROVIDER} from './sentry.service';

describe('SentryService', () => {
	describe('onModuleInit', () => {
		it('initializes Sentry with the correct options', async () => {
			const mockSentry = {
				init: jest.fn(),
			};

			const module: TestingModule = await Test.createTestingModule({
				providers: [
					SentryService,
					{
						provide: SENTRY_PROVIDER,
						useValue: mockSentry,
					},
					{
						provide: SentryConfig,
						useValue: {
							sentryDsn: 'test-dsn',
							release: 'test-release',
							environment: 'test-environment',
						},
					},
				],
			}).compile();

			const service = module.get<SentryService>(SentryService);

			expect(service.onModuleInit()).toBe(true);

			expect(mockSentry.init).toHaveBeenCalledTimes(1);
			expect(mockSentry.init).toHaveBeenCalledWith({
				dsn: 'test-dsn',
				release: 'test-release',
				environment: 'test-environment',
			});
		});

		it("doesn't initialize when no DSN is provided", async () => {
			const mockSentry = {
				init: jest.fn(),
			};

			const module: TestingModule = await Test.createTestingModule({
				providers: [
					SentryService,
					{
						provide: SENTRY_PROVIDER,
						useValue: mockSentry,
					},
					{
						provide: SentryConfig,
						useValue: {
							sentryDsn: undefined,
							release: 'test-release',
							environment: 'test-environment',
						},
					},
				],
			}).compile();

			const service = module.get<SentryService>(SentryService);

			expect(service.onModuleInit()).toBe(false);

			expect(mockSentry.init).toHaveBeenCalledTimes(0);
		});
	});
});
