import type {JsonValue} from 'type-fest';
import {z} from 'zod';

/**
 * Zero-width characters.
 */
const zeroWidth: string[] = [
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

const charactersSchema = z.array(z.string().min(1)).min(1).default(zeroWidth);
const charactersParser = z
	.string()
	.optional()
	.transform(characters => (characters === undefined ? undefined : (JSON.parse(characters) as JsonValue)));

/** The maximum number of short URLs that can be generated. */
const maxShortUrls = 1e9;

const lengthParser = z
	.string()
	.optional()
	.transform(length => (length === undefined ? undefined : Number(length)));

const rewritesSchema = z.object({}).catchall(z.string().min(1));
const rewritesParser = z
	.string()
	.optional()
	.transform(rewrites => (rewrites === undefined ? {} : (JSON.parse(rewrites) as JsonValue)));

export default function parse(processEnv: NodeJS.ProcessEnv) {
	/** Characters to use in the shortened ID for a URL. */
	const characters = charactersSchema.parse(charactersParser.parse(processEnv.SHORT_CHARS));

	/** The default length of a generated short ID. */
	let defaultShortLength = 1;

	while (characters.length ** defaultShortLength < maxShortUrls) {
		defaultShortLength++;
	}

	const lengthSchema = z.number().int().positive().default(defaultShortLength);

	/** The length of the shortened ID for a URL. */
	const length = lengthSchema.parse(lengthParser.parse(processEnv.SHORT_LENGTH));
	/** Rewrites applied to a URL before redirecting. */
	const rewrites = rewritesSchema.parse(rewritesParser.parse(processEnv.SHORT_REWRITES));

	return {characters, length, rewrites};
}
