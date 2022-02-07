import type {TestingModule} from '@nestjs/testing';
import {Test} from '@nestjs/testing';
import {OpenApiService} from './openapi.service';

describe('OpenApiService', () => {
	let service: OpenApiService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [OpenApiService],
		}).compile();

		service = module.get<OpenApiService>(OpenApiService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
