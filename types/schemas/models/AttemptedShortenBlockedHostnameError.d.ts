import Error from './Error';

/**
 * @title AttemptedShortenBlockedHostnameError
 * @description Shortening that hostname is forbidden
 */
export default interface AttemptedShortenBlockedHostnameError extends Error {
	statusCode: 422;
	code: 'E_SHORTEN_BLOCKED_HOSTNAME';
	error: 'Unprocessable Entity';
}
