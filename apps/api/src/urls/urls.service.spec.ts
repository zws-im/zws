import type {TestingModule} from '@nestjs/testing';
import {Test} from '@nestjs/testing';
import {UrlsService} from './urls.service';

describe.skip('UrlsService', () => {
	let service: UrlsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UrlsService],
		}).compile();

		service = module.get<UrlsService>(UrlsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
