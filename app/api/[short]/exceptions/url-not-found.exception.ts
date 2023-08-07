import { BaseException } from '@/app/api/exceptions/base.exception';
import { ExceptionCode } from '@/app/api/exceptions/enums/exceptions.enum';
import { Http } from '@jonahsnider/util';

/** Shortened URL not found in database. */
export class UrlNotFoundException extends BaseException {
	constructor() {
		super(
			'Shortened URL not found in database',
			Http.Status.NotFound,
			ExceptionCode.UrlNotFound,
		);
	}
}
