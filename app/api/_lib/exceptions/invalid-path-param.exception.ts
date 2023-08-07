import { Http } from '@jonahsnider/util';

import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { BaseHttpException } from './base.exception';
import { ExceptionCode } from './enums/exceptions.enum';

export class InvalidPathParamException extends BaseHttpException {
	constructor(zodError: z.ZodError<unknown>) {
		super(
			fromZodError(zodError).message,
			Http.Status.UnprocessableEntity,
			ExceptionCode.InvalidPathParams,
		);
	}
}
