import type {TransformFnParams} from 'class-transformer';
import yn from 'yn';

/**
 * Transforms a string to a boolean.
 *
 * For use with DTOs that use class-transformer.
 *
 * @returns The parsed boolean or `undefined` if the string couldn't be resolved to a boolean
 */
export function transformToBoolean(parameters: TransformFnParams): boolean | undefined {
	return yn(parameters.value);
}
