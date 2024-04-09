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

		const results = await Promise.all([
			this.blockedHostnamesService.isHostnameBlocked(actualUrl),
			this.safeBrowsingService.hasThreatMatches(actualUrl),
		]);

		return results.some(Boolean);
	}
}
