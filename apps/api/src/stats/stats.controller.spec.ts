import type {TestingModule} from '@nestjs/testing';
import {Test} from '@nestjs/testing';
import {StatsController} from './stats.controller';

describe('StatsController', () => {
	let controller: StatsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [StatsController],
		}).compile();

		controller = module.get<StatsController>(StatsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
