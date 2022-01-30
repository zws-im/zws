import {IsString, IsUrl, MaxLength} from 'class-validator';

/** A long URL. */
export class LongUrlDto {
	/**
	 * The absolute URL for the shortened URL.
	 * @example 'https://jonahsnider.com'
	 */
	@IsString()
	@MaxLength(500)
	@IsUrl()
	url!: string;
}
