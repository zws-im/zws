import {Http} from '@jonahsnider/util';
import createError from 'fastify-error';

/** When a user attempted to access a shortened URL that couldn't be found. */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const UrlNotFound = createError('E_URL_NOT_FOUND', 'Shortened URL not found in database', Http.Status.NotFound);

/** When a user attempted to shorten a URL that had the same hostname as the app does. */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const AttemptedShortenHostname = createError(
	'E_SHORTEN_HOSTNAME',
	'Shortening a URL with the same hostname as the server is disallowed',
	Http.Status.UnprocessableEntity,
);

/** The maximum number of attempts to generate a unique short ID were hit. */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const UniqueShortIdTimeout = createError(
	'E_UNIQUE_SHORT_ID_TIMEOUT',
	`Couldn't generate a unique shortened ID in %s attempts`,
	Http.Status.ServiceUnavailable,
);

/** An incorrect API key was provided. */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const IncorrectApiKey = createError('E_INCORRECT_API_KEY', 'The provided API key was not correct', Http.Status.Unauthorized);

/** An API key was required, but not provided. */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const MissingApiKey = createError('E_MISSING_API_KEY', 'You must provide an API key to access this route', Http.Status.Unauthorized);

/** The server failed a health check. */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const NotHealthy = createError('E_NOT_HEALTHY', 'The server is not healthy', Http.Status.InternalServerError);

/** You tried to shorten a blocked hostname. */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const AttemptedShortenBlockedHostname = createError(
	'E_SHORTEN_BLOCKED_HOSTNAME',
	'Shortening that hostname is forbidden',
	Http.Status.UnprocessableEntity,
);

/** You tried to access a URL that has been marked in the database as blocked. */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const UrlBlocked = createError('E_URL_BLOCKED', "That URL has been blocked and can't be visited", Http.Status.Gone);
