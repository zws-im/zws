import {IsString, IsUrl, MaxLength} from 'class-validator';

/** A long URL. */
export class LongUrlDto {
	/**
	 * A long (unshortened) URL.
	 * @example 'https://jonahsnider.com'
	 */
	// eslint-disable-next-line @typescript-eslint/parameter-properties
	@IsString()
	@MaxLength(500)
	@IsUrl()
	url: string;

	constructor(url: string) {
		this.url = url;
	}
}
