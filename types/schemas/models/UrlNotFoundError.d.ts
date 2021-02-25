import Error from './Error';

/**
 * @title UrlNotFoundError
 * @description Shortened URL not found in database
 */
export default interface UrlNotFoundError extends Error {
	statusCode: 404;
	code: 'E_URL_NOT_FOUND';
	error: 'Not Found';
}
