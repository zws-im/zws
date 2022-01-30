import {IsArray, IsInt} from 'class-validator';
import {LongUrlDto} from './long-url.dto';

/** Usage statistics for a shortened URL. */
export class UrlStatsDto extends LongUrlDto {
	/**
	 * Timestamps of when the shortened URL was visited.
	 *
	 * @example [1612663253652]
	 */
	@IsArray()
	@IsInt({each: true})
	visits!: number[];
}
