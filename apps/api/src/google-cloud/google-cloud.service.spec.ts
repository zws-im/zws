import type {TestingModule} from '@nestjs/testing';
import {Test} from '@nestjs/testing';
import {GoogleCloudConfig} from './google-cloud.config';
import {GoogleCloudService, PROFILER_PROVIDER} from './google-cloud.service';

describe('GoogleCloudService', () => {
	it('enables the profiler when credentials are provided', async () => {
		const mockProfiler = {
			start: jest.fn().mockResolvedValue(undefined),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GoogleCloudService,
				{
					provide: GoogleCloudConfig,
					useValue: {
						credentials: {
							projectId: 'test-project',
							keyFilename: 'test-key-file',
						},
						service: 'test-service',
						version: 'test-version',
					},
				},
				{
					provide: PROFILER_PROVIDER,
					useValue: mockProfiler,
				},
			],
		}).compile();

		const service = module.get<GoogleCloudService>(GoogleCloudService);

		expect(await service.onModuleInit()).toBe(true);

		expect(mockProfiler.start.mock.calls).toEqual([
			[
				{
					projectId: 'test-project',
					keyFilename: 'test-key-file',
					serviceContext: {
						version: 'test-version',
						service: 'test-service',
					},
				},
			],
		]);
	});

	it('does nothing when no credentials are provided', async () => {
		const mockProfiler = {
			start: jest.fn().mockResolvedValue(undefined),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GoogleCloudService,
				{
					provide: GoogleCloudConfig,
					useValue: {
						credentials: undefined,
						service: 'test-service',
						version: 'test-version',
					},
				},
				{
					provide: PROFILER_PROVIDER,
					useValue: mockProfiler,
				},
			],
		}).compile();

		const service = module.get<GoogleCloudService>(GoogleCloudService);

		expect(await service.onModuleInit()).toBe(false);

		expect(mockProfiler.start).not.toHaveBeenCalled();
	});
});
