import {Test, TestingModule} from '@nestjs/testing';
import {UrlsService} from './urls.service';

describe('UrlsService', () => {
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
