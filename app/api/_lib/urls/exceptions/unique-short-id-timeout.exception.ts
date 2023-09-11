import { Http } from '@jonahsnider/util';
import { BaseHttpException } from '../../exceptions/base.exception';
import { ExceptionCode } from '../../exceptions/enums/exceptions.enum';

/** The maximum number of attempts to generate a unique short ID were exceeded. */
export class UniqueShortIdTimeoutException extends BaseHttpException {
	constructor(attempts: number) {
		super(
			`Couldn't generate a unique shortened ID in ${attempts} attempts`,
			Http.Status.ServiceUnavailable,
			ExceptionCode.UniqueShortIdTimeout,
		);
	}
}
