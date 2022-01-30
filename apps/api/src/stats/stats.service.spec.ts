import {Test, TestingModule} from '@nestjs/testing';
import {StatsService} from './stats.service';

describe('StatsService', () => {
	let service: StatsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [StatsService],
		}).compile();

		service = module.get<StatsService>(StatsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
