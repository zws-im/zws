import type {TestingModule} from '@nestjs/testing';
import {Test} from '@nestjs/testing';
import {Logger} from './logger.service';

describe.skip('Logger', () => {
	let service: Logger;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [Logger],
		}).compile();

		service = module.get<Logger>(Logger);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
