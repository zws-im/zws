import {AuthGuard} from './auth.guard';

describe.skip('AuthGuard', () => {
	it('should be defined', () => {
		// @ts-expect-error Will be mocked when this test is written
		expect(new AuthGuard()).toBeDefined();
	});
});
