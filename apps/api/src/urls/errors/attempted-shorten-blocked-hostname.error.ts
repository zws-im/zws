import {Http} from '@jonahsnider/util';
import type * as Schemas from '@zws.im/schemas';
import {BaseException} from '../../errors/base.error';

/** You tried to shorten a blocked hostname. */
export class AttemptedShortenBlockedHostname extends BaseException<Schemas.Errors.AttemptedShortenBlockedHostname> {
	constructor() {
		super('E_SHORTEN_BLOCKED_HOSTNAME', 'Shortening that hostname is forbidden', Http.Status.UnprocessableEntity);
	}
}
