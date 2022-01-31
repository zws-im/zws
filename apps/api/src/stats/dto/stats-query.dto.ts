import {Type} from 'class-transformer';
import {IsBoolean} from 'class-validator';

export class StatsQueryDto {
	@IsBoolean()
	@Type(() => Boolean)
	format = false;
}
