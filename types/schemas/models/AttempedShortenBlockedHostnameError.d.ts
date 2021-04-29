import Error from './Error';

/**
 * @title AttempedShortenBlockedHostnameError
 * @description Shortening that hostname is forbidden
 */
export default interface AttempedShortenBlockedHostnameError extends Error {
	statusCode: 422;
	code: 'E_SHORTEN_BLOCKED_HOSTNAME';
	error: 'Unprocessable Entity';
}
