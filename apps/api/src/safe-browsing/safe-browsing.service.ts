import { Inject, Injectable, Logger } from '@nestjs/common';
import { captureException } from '@sentry/bun';
import convert from 'convert';
import { google, type safebrowsing_v4 } from 'googleapis';
import type { RedisClientType } from 'redis';
import { ConfigService } from '../config/config.service';
import { REDIS_PROVIDER } from '../redis/providers';

@Injectable()
export class SafeBrowsingService {
	private static readonly REDIS_PREFIX = 'safe-browsing:';

	private static normalizeUrl(url: URL): URL {
		const normalized = new URL(url.toString());
		normalized.hash = '';
		normalized.search = '';
		return normalized;
	}

	private readonly safebrowsing: safebrowsing_v4.Safebrowsing;
	private readonly apiKey: string;
	private readonly logger = new Logger(SafeBrowsingService.name);

	constructor(
		@Inject(ConfigService) configService: ConfigService,
		@Inject(REDIS_PROVIDER) private readonly redis: RedisClientType,
	) {
		this.safebrowsing = google.safebrowsing({
			version: 'v4',
		});

		this.apiKey = configService.googleApiKey;
	}

	/** This method doesn't throw, and instead returns `undefined` if there's an error with Google's API. */
	async hasThreatMatches(url: URL): Promise<boolean | undefined> {
		try {
			return await this.hasThreatMatchesThrowable(url);
		} catch (error) {
			// Log + report the error
			captureException(error);
			this.logger.error(error);

			// If Google is having an outage, just ignore it
			return undefined;
		}
	}

	private async hasThreatMatchesThrowable(url: URL): Promise<boolean> {
		const normalizedUrl = SafeBrowsingService.normalizeUrl(url);

		const cached = await this.redis.get(SafeBrowsingService.REDIS_PREFIX + normalizedUrl);

		if (cached === '1') {
			return true;
		}

		if (cached === '0') {
			return false;
		}

		const response = await this.safebrowsing.threatMatches.find({
			key: this.apiKey,
			requestBody: {
				client: {
					clientId: 'zws_api',
					clientVersion: '1.0.0',
				},
				threatInfo: {
					platformTypes: ['ANY_PLATFORM'],
					threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
					threatEntryTypes: ['URL'],
					threatEntries: [
						{
							url: normalizedUrl.toString(),
						},
					],
				},
			},
		});

		if (!response.data.matches || response.data.matches.length === 0) {
			await this.redis.set(SafeBrowsingService.REDIS_PREFIX + normalizedUrl, '0', { EX: convert(5, 'min').to('s') });
			return false;
		}

		for (const match of response.data.matches) {
			const cacheDurationSeconds = match.cacheDuration
				? Number(match.cacheDuration.slice(0, -'s'.length))
				: convert(5, 'min').to('s');
			const threatUrl = match.threat?.url ? SafeBrowsingService.normalizeUrl(new URL(match.threat.url)) : normalizedUrl;

			await this.redis.set(SafeBrowsingService.REDIS_PREFIX + threatUrl, '1', { EX: cacheDurationSeconds });
		}

		return true;
	}
}
