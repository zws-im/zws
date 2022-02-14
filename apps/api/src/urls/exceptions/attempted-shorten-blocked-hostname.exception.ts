import {Http} from '@jonahsnider/util';
import {ApiProperty} from '@nestjs/swagger';
import {BaseException} from '../../exceptions/base.exception';

const code = 'E_SHORTEN_BLOCKED_HOSTNAME';

/** You tried to shorten a blocked hostname. */
export class AttemptedShortenBlockedHostnameException extends BaseException {
	@ApiProperty({enum: [code]})
	code = code;

	constructor() {
		super('Shortening that hostname is forbidden', Http.Status.UnprocessableEntity);
	}
}
