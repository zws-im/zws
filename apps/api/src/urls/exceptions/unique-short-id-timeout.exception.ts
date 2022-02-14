import {Http} from '@jonahsnider/util';
import {ApiProperty} from '@nestjs/swagger';
import {BaseException} from '../../exceptions/base.exception';

const code = 'E_UNIQUE_SHORT_ID_TIMEOUT';

/** The maximum number of attempts to generate a unique short ID were exceeded. */
export class UniqueShortIdTimeoutException extends BaseException {
	@ApiProperty({enum: [code]})
	code = code;

	constructor(attempts: number) {
		super(`Couldn't generate a unique shortened ID in ${attempts} attempts`, Http.Status.ServiceUnavailable);
	}
}
