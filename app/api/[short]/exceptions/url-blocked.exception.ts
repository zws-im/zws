import { Http } from '@jonahsnider/util';
import { BaseException } from '../../exceptions/base.exception';
import { ExceptionCode } from '../../exceptions/enums/exceptions.enum';

/** That URL has been blocked and can't be visited. */
export class UrlBlockedException extends BaseException {
	constructor() {
		super(
			"That URL has been blocked and can't be visited",
			Http.Status.Gone,
			ExceptionCode.UrlBlocked,
		);
	}
}
