import { Http } from '@jonahsnider/util';
import { BaseHttpException } from '../../exceptions/base.exception';
import { ExceptionCode } from '../../exceptions/enums/exceptions.enum';

/** The provided API key doesn't have the correct permissions. */
export class MissingPermissionsException extends BaseHttpException {
	constructor() {
		super(
			'Your API key is recognized, but does not have the permissions required to access this route',
			Http.Status.Forbidden,
			ExceptionCode.MissingPermissions,
		);
	}
}
