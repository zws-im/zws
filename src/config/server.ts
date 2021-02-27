import ow from 'ow';
// eslint-disable-next-line node/prefer-global/url
import {URL} from 'url';
import {version} from '../../package.json';

export const port = process.env.PORT === undefined ? 3000 : Number(process.env.PORT);

const rawHostname = process.env.HOSTNAME;

ow(rawHostname, 'HOSTNAME', ow.optional.string);

const rawShortenedBaseUrl = process.env.SHORTENED_BASE_URL;

ow(rawShortenedBaseUrl, 'SHORTENED_BASE_URL', ow.optional.string.url);

export const hostname: null | string = rawHostname ?? null;

export const shortenedBaseUrl: null | URL = rawShortenedBaseUrl ? new URL(rawShortenedBaseUrl) : null;

export const apiKey: string | null = process.env.API_KEY ?? null;

export {version} from '../../package.json';

type UserAgent = `${string}/${string} (${string})`;

export const serverString: UserAgent = `ZWS/${version as '2.0.0'} (+https://zws.im)` as const;

export enum Tags {
	Urls = 'urls',
	Stats = 'stats',
	Shields = 'shields'
}
