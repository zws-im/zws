import {ApiProperty} from '@nestjs/swagger';
import {Matches} from 'class-validator';
import type {Stats} from '../interfaces/stats.interface';

const FORMATTED_VERSION_REG_EXP = /^v\d+\.\d+\.\d+(?:-.+)?$/;
const FORMATTED_NUMBER_REG_EXP = /^\d{1,3}(?:,\d{1,3})*$/;

// TODO: Once this PR is merged remove the @ApiProperty usage https://github.com/nestjs/swagger/pull/1788

export class FormattedStatsDto {
	/**
	 * @example 'v2.0.0'
	 */
	@ApiProperty({pattern: FORMATTED_VERSION_REG_EXP.source})
	@Matches(FORMATTED_VERSION_REG_EXP)
	version: string;

	/**
	 * @example '4,321'
	 */
	@ApiProperty({pattern: FORMATTED_NUMBER_REG_EXP.source})
	@Matches(FORMATTED_NUMBER_REG_EXP)
	urls: string;

	/**
	 * @example '4,321'
	 */
	@ApiProperty({pattern: FORMATTED_NUMBER_REG_EXP.source})
	@Matches(FORMATTED_NUMBER_REG_EXP)
	visits: string;

	constructor(version: string, stats: Stats) {
		this.version = `v${version}`;
		this.urls = stats.urls.toLocaleString();
		this.visits = stats.visits.toLocaleString();
	}
}
