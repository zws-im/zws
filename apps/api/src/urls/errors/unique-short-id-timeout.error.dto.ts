import {Http} from '@jonahsnider/util';
import type * as Schemas from '@zws.im/schemas';
import {BaseException} from '../../errors/base.error';

/** The maximum number of attempts to generate a unique short ID were exceeded. */
export class UniqueShortIdTimeout extends BaseException<Schemas.Errors.UniqueShortIdTimeout> {
	constructor(attempts: number) {
		super('E_UNIQUE_SHORT_ID_TIMEOUT', `Couldn't generate a unique shortened ID in ${attempts} attempts`, Http.Status.ServiceUnavailable);
	}
}
