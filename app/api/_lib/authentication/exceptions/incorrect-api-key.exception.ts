import { Http } from '@jonahsnider/util';
import { BaseHttpException } from '../../exceptions/base.exception';
import { ExceptionCode } from '../../exceptions/enums/exceptions.enum';

/** An incorrect API key was provided. */
export class IncorrectApiKeyException extends BaseHttpException {
	constructor() {
		super('The provided API key is incorrect', Http.Status.Unauthorized, ExceptionCode.IncorrectApiKey);
	}
}
