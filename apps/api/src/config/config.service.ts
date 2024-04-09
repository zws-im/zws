import { Injectable } from '@nestjs/common';
import { url, cleanEnv, json, num, port, str } from 'envalid';

type NodeEnv = 'production' | 'development' | 'staging';

const DEFAULT_SHORT_CHARS: readonly string[] = [
	'\u200C',
	'\u200D',
	'\uDB40\uDC61',
	'\uDB40\uDC62',
	'\uDB40\uDC63',
	'\uDB40\uDC64',
	'\uDB40\uDC65',
	'\uDB40\uDC66',
	'\uDB40\uDC67',
	'\uDB40\uDC68',
	'\uDB40\uDC69',
	'\uDB40\uDC6A',
	'\uDB40\uDC6B',
	'\uDB40\uDC6C',
	'\uDB40\uDC6D',
	'\uDB40\uDC6E',
	'\uDB40\uDC6F',
	'\uDB40\uDC70',
	'\uDB40\uDC71',
	'\uDB40\uDC72',
	'\uDB40\uDC73',
	'\uDB40\uDC74',
	'\uDB40\uDC75',
	'\uDB40\uDC76',
	'\uDB40\uDC77',
	'\uDB40\uDC78',
	'\uDB40\uDC79',
	'\uDB40\uDC7A',
	'\uDB40\uDC7F',
];

export const env = cleanEnv(process.env, {
	// biome-ignore lint/style/useNamingConvention: This is an environment variable
	NODE_ENV: str({ default: 'production', choices: ['production', 'development', 'staging'] }),
	// biome-ignore lint/style/useNamingConvention: This is an environment variable
	PORT: port({ default: 3000 }),
	// biome-ignore lint/style/useNamingConvention: This is an environment variable
	DATABASE_URL: url({ desc: 'PostgreSQL URL' }),
	// biome-ignore lint/style/useNamingConvention: This is an environment variable
	SENTRY_DSN: url({ desc: 'Sentry DSN' }),
	// biome-ignore lint/style/useNamingConvention: This is an environment variable
	REDIS_URL: url({ desc: 'Redis URL' }),
	// biome-ignore lint/style/useNamingConvention: This is an environment variable
	WEBSITE_URL: url({ desc: 'Website URL' }),
	// biome-ignore lint/style/useNamingConvention: This is an environment variable
	SHORT_LENGTH: num({ desc: 'Number of characters to generate in a shortened URL', default: 7 }),
	// biome-ignore lint/style/useNamingConvention: This is an environment variable
	SHORT_CHARS: json<readonly string[]>({
		desc: 'Characters to use in shortened URLs',
		default: DEFAULT_SHORT_CHARS,
	}),
	// biome-ignore lint/style/useNamingConvention: This is an environment variable
	SHORT_REWRITES: json<Record<string, string>>({
		desc: 'A mapping of characters to apply to short IDs before they are used',
		default: {},
	}),
	// biome-ignore lint/style/useNamingConvention: This is an environment variable
	GOOGLE_API_KEY: str({ desc: 'Google API Key' }),
});

@Injectable()
export class ConfigService {
	public readonly nodeEnv: NodeEnv;
	public readonly port: number;
	public readonly databaseUrl: string;
	public readonly sentryDsn: string;
	public readonly redisUrl: string;
	public readonly websiteUrl: string;
	public readonly shortenedLength: number;
	public readonly characters: readonly string[];
	public readonly version = '3.0.0';
	public readonly googleApiKey: string;

	constructor() {
		this.nodeEnv = env.NODE_ENV;
		this.port = env.PORT;
		this.databaseUrl = env.DATABASE_URL;
		this.sentryDsn = env.SENTRY_DSN;
		this.websiteUrl = env.WEBSITE_URL;
		this.redisUrl = env.REDIS_URL;
		this.shortenedLength = env.SHORT_LENGTH;
		this.characters = env.SHORT_CHARS;
		this.googleApiKey = env.GOOGLE_API_KEY;
	}
}
