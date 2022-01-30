import type {ExceptionFilter, ArgumentsHost} from '@nestjs/common';
import {Catch, HttpException} from '@nestjs/common';
import type {Response} from 'express';
import {BaseException} from './errors/base.error';

@Catch(BaseException)
export class HttpExceptionFilter implements ExceptionFilter<BaseException> {
	catch(exception: BaseException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus();

		response.status(status).json({
			statusCode: status,
			code: exception.code,
			message: exception.message,
			error: exception.name,
		});
	}
}
