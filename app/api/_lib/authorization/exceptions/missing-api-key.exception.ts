import { Http } from '@jonahsnider/util';
import { BaseHttpException } from '../../exceptions/base.exception';
import { ExceptionCode } from '../../exceptions/enums/exceptions.enum';

/** An API key was required, but not provided. */
export class MissingApiKeyException extends BaseHttpException {
	constructor() {
		super('You must provide an API key to access this route', Http.Status.Unauthorized, ExceptionCode.MissingApiKey);
	}
}
