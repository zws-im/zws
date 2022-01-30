import {HttpException} from '@nestjs/common';
import type * as Schemas from '@zws.im/schemas';

export class BaseException<T extends Schemas.Errors.GenericError = Schemas.Errors.GenericError> extends HttpException {
	constructor(public readonly code: NonNullable<T['code']>, public readonly message: T['message'], public readonly statusCode: T['statusCode']) {
		super(message, statusCode);
	}

	toString() {
		return `${this.name} [${this.code}]: ${this.message}` as const;
	}
}
