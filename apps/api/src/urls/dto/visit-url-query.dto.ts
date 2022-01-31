import {Type} from 'class-transformer';
import {IsBoolean} from 'class-validator';

export class VisitUrlQueryDto {
	@IsBoolean()
	@Type(() => Boolean)
	visit = true;
}
