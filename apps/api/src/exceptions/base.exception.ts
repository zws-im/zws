import {STATUS_CODES} from 'node:http';
import {HttpException} from '@nestjs/common';

export class BaseException extends HttpException {
	readonly error: string;
	readonly code: string | undefined;
	readonly statusCode: number;
	// This is only present for OpenAPI generation
	// @ts-expect-error The message field is defined by the base Error class
	readonly message: string;

	constructor(message: string, statusCode: number) {
		super(message, statusCode);

		this.statusCode = statusCode;
		this.error = STATUS_CODES[statusCode] ?? BaseException.name;
	}
}
