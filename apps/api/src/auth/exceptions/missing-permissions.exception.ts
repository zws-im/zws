import {Http} from '@jonahsnider/util';
import {ApiProperty} from '@nestjs/swagger';
import {BaseException} from '../../exceptions/base.exception';

const code = 'E_MISSING_PERMISSIONS';

/** An API key was required, but not provided. */
export class MissingPermissionsException extends BaseException {
	@ApiProperty({enum: [code]})
	code = code;

	constructor() {
		super('Your API key is recognized, but does not have the permissions required to access this route', Http.Status.Forbidden);
	}
}
