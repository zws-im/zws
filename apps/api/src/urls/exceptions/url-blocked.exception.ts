import {Http} from '@jonahsnider/util';
import {ApiProperty} from '@nestjs/swagger';
import {BaseException} from '../../exceptions/base.exception';

const code = 'E_URL_BLOCKED';

/** That URL has been blocked and can't be visited. */
export class UrlBlockedException extends BaseException {
	@ApiProperty({enum: [code]})
	code = code;

	constructor() {
		super("That URL has been blocked and can't be visited", Http.Status.Gone);
	}
}
