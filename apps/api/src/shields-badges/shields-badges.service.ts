import {Injectable} from '@nestjs/common';
import {millify} from 'millify';
import {AppConfig} from '../app-config/app.config';
import {StatsService} from '../stats/stats.service';
import {ShieldsResponseDto} from './dto/shields-response.dto';

@Injectable()
export class ShieldsBadgesService {
	/**
	 * Abbreviate a number for displaying in badges.
	 *
	 * @param number - Number to abbreviate
	 *
	 * @returns The abbreviated number
	 */
	static abbreviateNumber(number: number): string {
		return millify(number);
	}

	private readonly version: string;

	constructor(private readonly statsService: StatsService, config: AppConfig) {
		this.version = config.version;
	}

	async urlStatsBadge(): Promise<ShieldsResponseDto> {
		const instanceStats = await this.statsService.instanceStats();

		return new ShieldsResponseDto({
			color: 'informational',
			label: 'urls',
			message: ShieldsBadgesService.abbreviateNumber(instanceStats.urls),
		});
	}

	async visitsStatsBadge(): Promise<ShieldsResponseDto> {
		const instanceStats = await this.statsService.instanceStats();

		return new ShieldsResponseDto({
			color: 'informational',
			label: 'visits',
			message: ShieldsBadgesService.abbreviateNumber(instanceStats.visits),
		});
	}

	async versionBadge(): Promise<ShieldsResponseDto> {
		return new ShieldsResponseDto({
			color: 'informational',
			label: 'version',
			message: `v${this.version}`,
		});
	}
}
