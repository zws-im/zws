import type {ArgumentsHost} from '@nestjs/common';
import {BaseException} from '../exceptions/base.exception';
import {HttpExceptionFilter} from './http-exception.filter';

describe('HttpExceptionFilter', () => {
	describe('catch', () => {
		it('responds with custom error object', () => {
			const filter = new HttpExceptionFilter();

			const mockResponse = {
				status: jest.fn(),
				json: jest.fn(),
			};

			// Allow chainable calls
			mockResponse.status.mockReturnValue(mockResponse);

			const exception = new BaseException('Error message', 500);
			// @ts-expect-error Readonly property
			exception.code = 'E_CODE';

			const mockHost = {
				switchToHttp: jest.fn().mockReturnValue({
					getResponse: jest.fn().mockReturnValue(mockResponse),
				}),
			};

			filter.catch(exception, mockHost as any as ArgumentsHost);

			expect(mockResponse.status).toHaveBeenCalledTimes(1);
			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledTimes(1);
			expect(mockResponse.json).toHaveBeenCalledWith({
				statusCode: 500,
				code: 'E_CODE',
				message: 'Error message',
				error: 'Internal Server Error',
			});
		});
	});
});
