import { Inject, Injectable } from '@nestjs/common';
import { BlockedHostnamesService } from '../blocked-hostnames/blocked-hostnames.service';
import type { Schema } from '../db/index';
import { SafeBrowsingService } from '../safe-browsing/safe-browsing.service';

@Injectable()
export class BlockedUrlsService {
	constructor(
		@Inject(BlockedHostnamesService) private readonly blockedHostnamesService: BlockedHostnamesService,
		@Inject(SafeBrowsingService) private readonly safeBrowsingService: SafeBrowsingService,
	) {}

	async isUrlBlocked(url: Pick<(typeof Schema)['urls']['$inferSelect'], 'blocked' | 'url'> | URL): Promise<boolean> {
		const actualUrl = 'blocked' in url ? new URL(url.url) : url;

		if ('blocked' in url && url.blocked) {
			return true;
		}

		const matchesCaptchaPhishHeuristic = this.matchesCaptchaPhishHeuristic(actualUrl);

		if (matchesCaptchaPhishHeuristic) {
			return true;
		}

		const results = await Promise.all([
			this.blockedHostnamesService.isHostnameBlocked(actualUrl),
			this.safeBrowsingService.hasThreatMatches(actualUrl),
		]);

		return results.some(Boolean);
	}

	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: I don't want to make this a separate function
	private matchesCaptchaPhishHeuristic(url: URL): boolean {
		let score = 0;

		if (url.host.endsWith('.xyz') || url.host.endsWith('.top') || url.host.endsWith('.online')) {
			score++;
		}

		if (url.hostname.includes('captcha')) {
			score++;
		}

		if (url.hostname.includes('server') || url.hostname.includes('bot')) {
			score++;
		}

		if (url.pathname === '/verify') {
			score++;
		}

		if (url.searchParams.has('data')) {
			score++;

			const data = url.searchParams.get('data');

			if (data) {
				try {
					const decoded = JSON.parse(Buffer.from(data, 'base64').toString('utf8'));

					if ('guildId' in decoded || 'clientId' in decoded) {
						return true;
					}
				} catch {}
			}
		}

		return score >= 3;
	}
}
