import {Transform} from 'class-transformer';
import {IsBoolean} from 'class-validator';
import {transformToBoolean} from '../../utils/transform';

export class VisitUrlQueryDto {
	@IsBoolean()
	@Transform(transformToBoolean)
	visit?: boolean = true;
}
