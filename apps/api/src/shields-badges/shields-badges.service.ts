import { Inject, Injectable } from '@nestjs/common';
import { millify } from 'millify';
import { ConfigService } from '../config/config.service.js';
import { StatsService } from '../stats/stats.service.js';
import type { ShieldsResponseSchema } from './dtos/shields-response.dto.js';

@Injectable()
export class ShieldsBadgesService {
	/**
	 * Abbreviate a number for displaying in badges.
	 *
	 * @param number - Number to abbreviate
	 *
	 * @returns The abbreviated number
	 */
	private static abbreviateNumber(number: number): string {
		return millify(number);
	}

	private readonly version: string;

	constructor(
		@Inject(StatsService) private readonly statsService: StatsService,
		@Inject(ConfigService) config: ConfigService,
	) {
		this.version = config.version;
	}

	async getUrlStatsBadge(): Promise<ShieldsResponseSchema> {
		const instanceStats = await this.statsService.getInstanceStats();

		return {
			schemaVersion: 1,
			color: 'informational',
			label: 'urls',
			message: ShieldsBadgesService.abbreviateNumber(instanceStats.urls),
		};
	}

	async getVisitsStatsBadge(): Promise<ShieldsResponseSchema> {
		const instanceStats = await this.statsService.getInstanceStats();

		return {
			schemaVersion: 1,
			color: 'informational',
			label: 'visits',
			message: ShieldsBadgesService.abbreviateNumber(instanceStats.visits),
		};
	}

	getVersionBadge(): ShieldsResponseSchema {
		return {
			schemaVersion: 1,
			color: 'informational',
			label: 'version',
			message: `v${this.version}`,
		};
	}
}
