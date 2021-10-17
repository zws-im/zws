import {Http} from '@jonahsnider/util';
import type {GenericError} from '../schemas/errors/GenericError.js';
import type * as Schemas from '../schemas/index.js';

class ZwsError<T extends GenericError> extends Error {
	constructor(public readonly code: NonNullable<T['code']>, public readonly message: T['message'], public readonly statusCode: T['statusCode']) {
		super(message);
	}

	toString() {
		return `${this.name} [${this.code}]: ${this.message}` as const;
	}
}

/** When a user attempted to access a shortened URL that couldn't be found. */
export class UrlNotFound extends ZwsError<Schemas.Errors.UrlNotFound> {
	constructor() {
		super('E_URL_NOT_FOUND', 'Shortened URL not found in database', Http.Status.NotFound);
	}
}

/** When a user attempted to shorten a URL that had the same hostname as the app does. */
export class AttemptedShortenHostname extends ZwsError<Schemas.Errors.AttemptedShortenHostname> {
	constructor() {
		super('E_SHORTEN_HOSTNAME', 'Shortening a URL with the same hostname as the server is disallowed', Http.Status.UnprocessableEntity);
	}
}

/** The maximum number of attempts to generate a unique short ID were hit. */
export class UniqueShortIdTimeout extends ZwsError<Schemas.Errors.UniqueShortIdTimeout> {
	constructor(attempts: number) {
		super('E_UNIQUE_SHORT_ID_TIMEOUT', `Couldn't generate a unique shortened ID in ${attempts} attempts`, Http.Status.ServiceUnavailable);
	}
}

/** An incorrect API key was provided. */
export class IncorrectApiKey extends ZwsError<Schemas.Errors.IncorrectApiKey> {
	constructor() {
		super('E_INCORRECT_API_KEY', 'The provided API key was not correct', Http.Status.Unauthorized);
	}
}

/** An API key was required, but not provided. */
export class MissingApiKey extends ZwsError<Schemas.Errors.MissingApiKey> {
	constructor() {
		super('E_MISSING_API_KEY', 'You must provide an API key to access this route', Http.Status.Unauthorized);
	}
}

/** The server failed a health check. */
export class NotHealthy extends ZwsError<Schemas.Errors.NotHealthy> {
	constructor() {
		super('E_NOT_HEALTHY', 'The server is not healthy', Http.Status.InternalServerError);
	}
}

/** You tried to shorten a blocked hostname. */
export class AttemptedShortenBlockedHostname extends ZwsError<Schemas.Errors.AttemptedShortenBlockedHostname> {
	constructor() {
		super('E_SHORTEN_BLOCKED_HOSTNAME', 'Shortening that hostname is forbidden', Http.Status.UnprocessableEntity);
	}
}

/** You tried to access a URL that has been marked in the database as blocked. */
export class UrlBlocked extends ZwsError<Schemas.Errors.UrlBlocked> {
	constructor() {
		super('E_URL_BLOCKED', "That URL has been blocked and can't be visited", Http.Status.Gone);
	}
}
