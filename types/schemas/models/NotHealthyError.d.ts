import Error from './Error';

/**
 * @title NotHealthyError
 * @description The server is not healthy
 */
export default interface NotHealthyError extends Error {
	statusCode: 500;
	code: 'E_NOT_HEALTHY';
	error: 'Internal Server Error';
}
