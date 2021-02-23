import createError from 'fastify-error';

/** When a user attempted to access a shortened URL that couldn't be found. */
export const UrlNotFound = createError('E_URL_NOT_FOUND', 'Shortened URL not found in database', 404);

/** When a user attempted to shorten a URL that had the same hostname as the app does. */
export const AttemptedShortenHostname = createError('E_SHORTEN_HOSTNAME', 'Shortening a URL with the same hostname as the server is disallowed', 422);

/** The maximum number of attempts to generate a unique short ID were hit. */
export const UniqueShortIdTimeout = createError('E_UNIQUE_SHORT_ID_TIMEOUT', `Couldn't generate a unique shortened ID in %s attempts`, 503);

/** An incorrect API key was provided. */
export const IncorrectApiKey = createError('E_INCORRECT_API_KEY', 'The provided API key was not correct', 401);

/** An API key was required, but not provided. */
export const MissingApiKey = createError('E_MISSING_API_KEY', 'You must provide an API key to access this route', 401);
