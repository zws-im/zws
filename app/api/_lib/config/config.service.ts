import { JsonValue } from 'type-fest';
import { z } from 'zod';

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

/** The maximum number of short URLs that can be generated. */
const MAX_SHORT_URLS = 1e9;

export class ConfigService {
	public readonly characters: readonly string[];
	public readonly shortenedLength: number;
	public readonly shortCharRewrites: Readonly<Record<string, string>>;
	public readonly shortenedBaseUrl: string | undefined;
	public readonly blockedHostnames: ReadonlySet<string>;

	constructor(source: Readonly<Record<string, unknown>>) {
		this.characters = z
			.array(z.string().min(1))
			.min(1)
			.default([...DEFAULT_SHORT_CHARS])
			.parse(
				z
					.string()
					.optional()
					.transform((characters) =>
						characters === undefined
							? undefined
							: (JSON.parse(characters) as JsonValue),
					)
					.parse(source.SHORT_CHARS),
			);

		this.shortenedLength = z
			.number()
			.int()
			.positive()
			.default(() => {
				let shortenedLength = 1;
				while (this.characters.length ** shortenedLength < MAX_SHORT_URLS) {
					shortenedLength++;
				}
				return shortenedLength;
			})
			.parse(
				z
					.string()
					.transform((raw) => (raw === undefined ? undefined : Number(raw)))
					.parse(source.SHORT_LENGTH),
			);

		this.shortCharRewrites = z
			.object({})
			.catchall(z.string().min(1))
			.parse(
				z
					.string()
					.optional()
					.transform((rewrites) =>
						rewrites === undefined ? {} : (JSON.parse(rewrites) as JsonValue),
					)
					.parse(source.SHORT_REWRITES),
			);

		this.shortenedBaseUrl = z
			.string()
			.optional()
			.parse(source.SHORTENED_BASE_URL);

		this.blockedHostnames = new Set(
			z
				.array(z.string().min(1))
				.default([])
				.parse(
					z
						.string()
						.optional()
						.transform((hostnames) =>
							hostnames === undefined
								? []
								: (JSON.parse(hostnames) as JsonValue),
						)
						.parse(source.BLOCKED_HOSTNAMES),
				),
		);
	}
}

export const configService = new ConfigService(process.env);
