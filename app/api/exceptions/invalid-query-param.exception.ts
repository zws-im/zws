import { Http } from '@jonahsnider/util';

import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { BaseException } from './base.exception';
import { ExceptionCode } from './enums/exceptions.enum';

export class InvalidQueryParamsException extends BaseException {
	constructor(zodError: z.ZodError<unknown>) {
		super(
			fromZodError(zodError).message,
			Http.Status.UnprocessableEntity,
			ExceptionCode.InvalidQueryParamS,
		);
	}
}
