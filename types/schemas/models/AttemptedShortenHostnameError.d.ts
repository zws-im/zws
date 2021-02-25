import Error from './Error';

/**
 * @title AttemptedShortenHostnameError
 * @description Shortening a URL with the same hostname as the server is disallowed
 */
export default interface AttemptedShortenHostnameError extends Error {
	statusCode: 422;
	code: 'E_SHORTEN_HOSTNAME';
	error: 'Unprocessable Entity';
}
