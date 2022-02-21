import type {OnModuleInit} from '@nestjs/common';
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import type {JsonValue} from 'type-fest';
import {z} from 'zod';
import type {EnvironmentVariables} from '../interfaces/config.interface';
import type {Logger} from '../logger/interfaces/logger.interface';
import {LoggerService} from '../logger/logger.service';

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

@Injectable()
export class UrlsConfigService implements OnModuleInit {
	readonly shortenedLength: number;
	readonly characters: readonly string[];
	readonly shortCharRewrites: Readonly<Record<string, string>> | undefined;
	readonly baseUrlForShortenedUrls: string | undefined;
	readonly blockedHostnames: ReadonlySet<string>;

	private readonly logger: Logger;

	constructor(private readonly configService: ConfigService<EnvironmentVariables>, logger: LoggerService) {
		this.characters = this.getShortChars();
		this.shortenedLength = this.getShortLength(this.characters.length);
		this.shortCharRewrites = this.getShortRewrites();
		this.baseUrlForShortenedUrls = this.getShortenedBaseUrl();
		this.blockedHostnames = this.getBlockedHostnames();

		this.logger = logger.createLogger().withTag('config').withTag('urls');
	}

	onModuleInit(): void {
		this.logger.info('characters:', this.characters);
		this.logger.info('length:', this.shortenedLength);
		this.logger.info('rewrites:', this.shortCharRewrites);
		this.logger.info('base URL:', this.baseUrlForShortenedUrls);
		this.logger.info('number of blocked hostnames:', this.blockedHostnames.size);
	}

	private getShortLength(characterSetSize: number): number {
		/** The default length of a generated short ID. */
		let defaultShortLength = 1;

		while (characterSetSize ** defaultShortLength < MAX_SHORT_URLS) {
			defaultShortLength++;
		}

		const schema = z.number().int().positive().default(defaultShortLength);
		const parser = z
			.string()
			.optional()
			.transform(length => (length === undefined ? undefined : Number(length)));

		const raw = this.configService.get<string>('SHORT_LENGTH');

		return schema.parse(parser.parse(raw));
	}

	private getShortChars(): string[] {
		const schema = z
			.array(z.string().min(1))
			.min(1)
			.default([...DEFAULT_SHORT_CHARS]);
		const parser = z
			.string()
			.optional()
			.transform(characters => (characters === undefined ? undefined : (JSON.parse(characters) as JsonValue)));

		const raw = this.configService.get<string>('SHORT_CHARS');

		return schema.parse(parser.parse(raw));
	}

	private getShortRewrites(): Record<string, string> {
		const schema = z.object({}).catchall(z.string().min(1));
		const parser = z
			.string()
			.optional()
			.transform(rewrites => (rewrites === undefined ? {} : (JSON.parse(rewrites) as JsonValue)));

		const raw = this.configService.get<string>('SHORT_REWRITES');

		return schema.parse(parser.parse(raw));
	}

	private getShortenedBaseUrl(): string | undefined {
		return this.configService.get('SHORTENED_BASE_URL');
	}

	private getBlockedHostnames(): Set<string> {
		const schema = z.array(z.string().min(1)).default([]);
		const parser = z
			.string()
			.optional()
			.transform(hostnames => (hostnames === undefined ? [] : (JSON.parse(hostnames) as JsonValue)));

		const raw = this.configService.get<string>('BLOCKED_HOSTNAMES');

		return new Set(schema.parse(parser.parse(raw)));
	}
}
