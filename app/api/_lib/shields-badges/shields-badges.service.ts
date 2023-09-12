import { millify } from 'millify';
import { StatsService, statsService } from '../stats/stats.service';

import { ConfigService, configService } from '../config/config.service';
import { ShieldsResponseSchema } from './dtos/shields-response.dto';

class ShieldsBadgesService {
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

	constructor(private readonly statsService: StatsService, config: ConfigService) {
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

export const shieldsBadgesService = new ShieldsBadgesService(statsService, configService);
