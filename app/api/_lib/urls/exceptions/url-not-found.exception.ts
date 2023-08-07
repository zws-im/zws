import { Http } from '@jonahsnider/util';
import { BaseHttpException } from '../../exceptions/base.exception';
import { ExceptionCode } from '../../exceptions/enums/exceptions.enum';

/** Shortened URL not found in database. */
export class UrlNotFoundException extends BaseHttpException {
	constructor() {
		super('Shortened URL not found in database', Http.Status.NotFound, ExceptionCode.UrlNotFound);
	}
}
