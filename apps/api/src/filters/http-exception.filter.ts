import type {ArgumentsHost, ExceptionFilter} from '@nestjs/common';
import {Catch} from '@nestjs/common';
import type {Response} from 'express';
import {BaseException} from '../exceptions/base.exception';

@Catch(BaseException)
export class HttpExceptionFilter implements ExceptionFilter<BaseException> {
	catch(exception: BaseException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus();

		response.status(status).json({
			statusCode: exception.statusCode,
			code: exception.code,
			message: exception.message,
			error: exception.error,
		});
	}
}
