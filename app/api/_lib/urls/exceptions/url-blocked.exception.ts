import { Http } from '@jonahsnider/util';
import { BaseHttpException } from '../../exceptions/base.exception';
import { ExceptionCode } from '../../exceptions/enums/exceptions.enum';

/** That URL has been blocked and can't be visited. */
export class UrlBlockedException extends BaseHttpException {
	constructor() {
		super("That URL has been blocked and can't be visited", Http.Status.Gone, ExceptionCode.UrlBlocked);
	}
}
