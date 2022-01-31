import {Transform} from 'class-transformer';
import {IsBoolean} from 'class-validator';
import {transformToBoolean} from '../../utils/transform';

export class StatsQueryDto {
	@IsBoolean()
	@Transform(transformToBoolean)
	format?: boolean = false;
}
