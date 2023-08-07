import { Http } from '@jonahsnider/util';
import { BaseException } from './base.exception';
import { ExceptionCode } from './enums/exceptions.enum';

/** You tried to shorten a blocked hostname. */
export class AttemptedShortenBlockedHostnameException extends BaseException {
	constructor() {
		super(
			"Shortening that hostname is forbidden",
			Http.Status.UnprocessableEntity,
			ExceptionCode.ShortenBlockedHostname,
		);
	}
}
