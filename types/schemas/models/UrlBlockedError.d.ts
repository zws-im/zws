import Error from './Error';

/**
 * @title UrlBlockedError
 * @description That URL has been blocked and can't be visited
 */
export default interface UrlBlockedError extends Error {
	statusCode: 410;
	code: 'E_URL_BLOCKED';
	error: 'Gone';
}
