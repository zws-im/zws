import Error from './Error';

/**
 * @title MissingApiKeyError
 * @description You must provide an API key to access this route
 */
export default interface MissingApiKeyError extends Error {
	statusCode: 401;
	code: 'E_MISSING_API_KEY';
	error: 'Unauthorized';
}
