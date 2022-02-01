import type {TestingModule} from '@nestjs/testing';
import {Test} from '@nestjs/testing';
import {ShieldsBadgesService} from './shields-badges.service';

describe.skip('ShieldsBadgesService', () => {
	let service: ShieldsBadgesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ShieldsBadgesService],
		}).compile();

		service = module.get<ShieldsBadgesService>(ShieldsBadgesService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
