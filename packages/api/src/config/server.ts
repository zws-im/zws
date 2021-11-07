import {URL} from 'node:url';
import yn from 'yn';
import {z} from 'zod';
import pkg from '../../package.json';

const portSchema = z.number().int().positive().default(3000);
const portParser = z
	.string()
	.optional()
	.transform(port => (port === undefined ? undefined : Number(port)));

const hostnameSchema = z.string().nullable().optional().default(null);

const shortenedBaseUrlSchema = z.string().url().optional();

const apiKeySchema = z.string().nullable().optional().default(null);

const smokeTestSchema = z
	.string()
	.nullish()
	.transform(smokeTest => yn(smokeTest));

type UserAgent = `${string}/${string} (${string})`;

const {version} = pkg;

const serverString: UserAgent = `ZWS/${version as '2.0.0'} (+https://zws.im)` as const;

export default function parse(processEnv: NodeJS.ProcessEnv) {
	const port = portSchema.parse(portParser.parse(processEnv.PORT));

	const hostname: string | null = hostnameSchema.parse(processEnv.HOSTNAME);

	const parsedShortenedBaseUrl = shortenedBaseUrlSchema.parse(processEnv.SHORTENED_BASE_URL);
	const shortenedBaseUrl: URL | null = parsedShortenedBaseUrl ? new URL(parsedShortenedBaseUrl) : null;

	const apiKey: string | null = apiKeySchema.parse(processEnv.API_KEY);

	const isSmokeTest = smokeTestSchema.parse(processEnv.SMOKE_TEST);

	return {port, hostname, shortenedBaseUrl, apiKey, serverString, version, isSmokeTest};
}
