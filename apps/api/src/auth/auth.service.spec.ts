import type {TestingModule} from '@nestjs/testing';
import {Test} from '@nestjs/testing';
import {AuthService} from './auth.service';

describe('AuthService static', () => {
	describe('hashApiKey', () => {
		it('should use SHA-512', () => {
			expect(AuthService.hashApiKey('hello').digest('hex')).toBe(
				'9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043',
			);
		});
	});
});

describe.skip('AuthService', () => {
	let service: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AuthService],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
