import createError from 'fastify-error';

/** When a user attempted to access a shortened URL that couldn't be found. */
export const UrlNotFound = createError('E_URL_NOT_FOUND', 'Shortened URL not found in database', 404);

/** When a user attempted to shorten a URL that had the same hostname as the app does. */
export const AttemptedShortenHostname = createError('E_SHORTEN_HOSTNAME', 'Shortening a URL with the same hostname as the server is disallowed', 422);

export const UniqueShortIdTimeout = createError('E_UNIQUE_SHORT_ID_TIMEOUT', `Couldn't generate a new shortened ID in %s attempts`, 503);
