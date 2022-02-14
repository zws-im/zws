import {Http} from '@jonahsnider/util';
import {ApiProperty} from '@nestjs/swagger';
import {BaseException} from '../../exceptions/base.exception';

const code = 'E_MISSING_API_KEY';

/** An API key was required, but not provided. */
export class MissingApiKeyException extends BaseException {
	@ApiProperty({enum: [code]})
	code = code;

	constructor() {
		super('You must provide an API key to access this route', Http.Status.Unauthorized);
	}
}
