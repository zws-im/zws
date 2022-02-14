import type {TestingModule} from '@nestjs/testing';
import {Test} from '@nestjs/testing';
import {AppConfig} from '../app-config/app.config';
import {OpenApiService} from './openapi.service';

describe('OpenApiService', () => {
	let service: OpenApiService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				OpenApiService,
				{
					provide: AppConfig,
					useValue: {
						hostname: 'hostname',
						port: 3000,
					},
				},
			],
		}).compile();

		service = module.get<OpenApiService>(OpenApiService);
	});

	describe('getConfig', () => {
		it('generates a config', () => {
			const config = service.getConfig();

			// Version changes very frequently so testing it is very annoying
			config.info.version = 'VERSION';

			expect(config).toMatchSnapshot('config');
		});
	});
});
