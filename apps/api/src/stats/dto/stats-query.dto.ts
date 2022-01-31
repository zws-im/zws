import {Transform} from 'class-transformer';
import {IsBoolean} from 'class-validator';
import {transformToBoolean} from '../../utils/transform';

export class StatsQueryDto {
	/**
	 * Whether to format the numbers in the response as strings.
	 */
	@IsBoolean()
	@Transform(transformToBoolean)
	format?: boolean = false;
}
