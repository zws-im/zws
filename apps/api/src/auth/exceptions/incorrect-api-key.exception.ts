import {Http} from '@jonahsnider/util';
import {ApiProperty} from '@nestjs/swagger';
import {BaseException} from '../../exceptions/base.exception';

const code = 'E_INCORRECT_API_KEY';

/** An incorrect API key was provided. */
export class IncorrectApiKeyException extends BaseException {
	@ApiProperty({enum: [code]})
	code = code;

	constructor() {
		super('The provided API key is incorrect', Http.Status.Unauthorized);
	}
}
