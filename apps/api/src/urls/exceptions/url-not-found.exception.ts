import {Http} from '@jonahsnider/util';
import {ApiProperty} from '@nestjs/swagger';
import {BaseException} from '../../exceptions/base.exception';

const code = 'E_URL_NOT_FOUND';

/** Shortened URL not found in database. */
export class UrlNotFoundException extends BaseException {
	@ApiProperty({enum: [code]})
	code = code;

	constructor() {
		super('Shortened URL not found in database', Http.Status.NotFound);
	}
}
