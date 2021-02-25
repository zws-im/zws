import Error from './Error';

/**
 * @title UniqueShortIdTimeoutError
 * @description Couldn't generate a unique shortened ID in time
 */
export default interface UniqueShortIdTimeoutError extends Error {
	statusCode: 503;
	code: 'E_UNIQUE_SHORT_ID_TIMEOUT';
	error: 'Service Unavailable';
}
