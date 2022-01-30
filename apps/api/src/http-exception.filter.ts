import {ExceptionFilter, Catch, ArgumentsHost, HttpException} from '@nestjs/common';
import {Response} from 'express';
import {BaseException as BaseException} from './errors/base.error';

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
