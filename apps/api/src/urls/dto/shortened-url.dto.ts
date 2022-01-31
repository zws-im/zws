import {IsOptional, IsString, IsUrl} from 'class-validator';
import {Short} from '../urls.service';

/** A shortened URL. */
export class ShortenedUrlDto {
	/**
	 * The short ID.
	 *
	 * @example 'abcxyz'
	 */
	@IsString()
	short: Short;

	/**
	 * The absolute URL for the shortened URL.
	 * Only present when the `SHORTENED_BASE_URL` environment variable is configured on the server.
	 *
	 * @example 'https://zws.im/abcxyz'
	 */
	@IsOptional()
	@IsUrl()
	url?: string;

	constructor(short: Short, url?: string) {
		this.short = short;

		if (url) {
			this.url = decodeURI(url);
		}
	}
}
