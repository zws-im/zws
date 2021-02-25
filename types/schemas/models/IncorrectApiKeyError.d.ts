import Error from './Error';

/**
 * @title IncorrectApiKeyError
 * @description The provided API key was incorrect
 */
export default interface IncorrectApiKeyError extends Error {
	statusCode: 401;
	code: 'E_INCORRECT_API_KEY';
	error: 'Unauthorized';
}
