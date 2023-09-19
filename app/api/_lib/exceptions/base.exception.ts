import { STATUS_CODES } from 'node:http';
import { TO_RESPONSE } from 'next-api-utils';
import { NextResponse } from 'next/server';
import { ExceptionSchema } from './dtos/exception.dto';
import { ExceptionCode } from './enums/exceptions.enum';

export class BaseHttpException extends Error {
	readonly error: string;
	readonly code: ExceptionCode | undefined;
	readonly statusCode: number;

	constructor(message: string, statusCode: number, code: ExceptionCode | undefined) {
		super(message);

		this.code = code;
		this.statusCode = statusCode;
		this.error = STATUS_CODES[statusCode] ?? BaseHttpException.name;
	}

	[TO_RESPONSE](): NextResponse<ExceptionSchema> {
		return NextResponse.json(
			{
				statusCode: this.statusCode,
				error: this.error,
				code: this.code,
				message: this.message,
			},
			{ status: this.statusCode },
		);
	}
}
