// eslint-disable-next-line node/prefer-global/url
import {URL} from 'url';
import {z} from 'zod';
import {version} from '../../package.json';

const portSchema = z.number().int().positive().default(3000);
const portParser = z
	.string()
	.optional()
	.transform(port => (port === undefined ? undefined : Number(port)));
export const port = portSchema.parse(portParser.parse(process.env.PORT));

const hostnameSchema = z.string().nullable().optional().default(null);
export const hostname: string | null = hostnameSchema.parse(process.env.HOSTNAME);

const shortenedBaseUrlSchema = z.string().url().optional();
const parsedShortenedBaseUrl = shortenedBaseUrlSchema.parse(process.env.SHORTENED_BASE_URL);
export const shortenedBaseUrl: URL | null = parsedShortenedBaseUrl ? new URL(parsedShortenedBaseUrl) : null;

const apiKeySchema = z.string().nullable().optional().default(null);
export const apiKey: string | null = apiKeySchema.parse(process.env.API_KEY);

export {version} from '../../package.json';

type UserAgent = `${string}/${string} (${string})`;

export const serverString: UserAgent = `ZWS/${version as '2.0.0'} (+https://zws.im)` as const;

export enum Tags {
	Urls = 'urls',
	Stats = 'stats',
	Shields = 'shields',
	Health = 'health'
}
