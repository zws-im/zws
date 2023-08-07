import { Http } from '@jonahsnider/util';
import { BaseException } from './base.exception';
import { ExceptionCode } from './enums/exceptions.enum';

/** The maximum number of attempts to generate a unique short ID were exceeded. */
export class UniqueShortIdTimeoutException extends BaseException {
	constructor(attempts: number) {
		super(
			`Couldn't generate a unique shortened ID in ${attempts} attempts`,
			Http.Status.ServiceUnavailable,
			ExceptionCode.UniqueShortIdTimeout,
		);
	}
}
