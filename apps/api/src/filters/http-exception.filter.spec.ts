import {HttpExceptionFilter} from './http-exception.filter';

describe.skip('HttpExceptionFilter', () => {
	it('should be defined', () => {
		expect(new HttpExceptionFilter()).toBeDefined();
	});
});
