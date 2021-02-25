/**
 * @title Error
 * @description Generic error response
 */
export default interface Error {
	/**
	 * @asType integer
	 * @example 500
	 * @maximum 599
	 * @minimum 400
	 */
	statusCode: number;
	message: string;
	/**
	 * @example 'Internal Server Error'
	 */
	error: string;
	code?: string;
}
