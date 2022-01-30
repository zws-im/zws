import {Test, TestingModule} from '@nestjs/testing';
import {ShieldsBadgesController} from './shields-badges.controller';

describe('ShieldsBadgesController', () => {
	let controller: ShieldsBadgesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ShieldsBadgesController],
		}).compile();

		controller = module.get<ShieldsBadgesController>(ShieldsBadgesController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
