import type {Short} from '../urls.service';

/** A shortened URL. */
export class ShortenedUrlDto {
	/**
	 * The short ID.
	 *
	 * @example 'abcxyz'
	 */
	short!: Short;

	/**
	 * The absolute URL for the shortened URL.
	 * Only present when the `SHORTENED_BASE_URL` environment variable is configured on the server.
	 *
	 * @example 'https://zws.im/abcxyz'
	 */
	url?: string;
}
