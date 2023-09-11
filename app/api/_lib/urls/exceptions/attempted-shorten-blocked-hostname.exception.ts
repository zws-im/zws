import { Http } from '@jonahsnider/util';
import { BaseHttpException } from '../../exceptions/base.exception';
import { ExceptionCode } from '../../exceptions/enums/exceptions.enum';

/** You tried to shorten a blocked hostname. */
export class AttemptedShortenBlockedHostnameException extends BaseHttpException {
	constructor() {
		super(
			'Shortening that hostname is forbidden',
			Http.Status.UnprocessableEntity,
			ExceptionCode.ShortenBlockedHostname,
		);
	}
}
