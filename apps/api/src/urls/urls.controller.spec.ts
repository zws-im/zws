import {Test, TestingModule} from '@nestjs/testing';
import {UrlsController} from './urls.controller';

describe('UrlsController', () => {
	let controller: UrlsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UrlsController],
		}).compile();

		controller = module.get<UrlsController>(UrlsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
