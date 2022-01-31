import {ApiProperty} from '@nestjs/swagger';
import {IsInt, Matches, Min} from 'class-validator';
import type {Stats} from '../interfaces/stats.interface';

const VERSION_REG_EXP = /^\d+\.\d+\.\d+(?:-.+)?$/;
// TODO: Once this PR is merged remove the @ApiProperty usage https://github.com/nestjs/swagger/pull/1788

export class RawStatsDto {
	/**
	 * @example '2.0.0'
	 */
	@ApiProperty({pattern: VERSION_REG_EXP.source})
	@Matches(VERSION_REG_EXP)
	version: string;

	/**
	 * @example 4321
	 */
	@IsInt()
	@Min(0)
	urls: number;

	/**
	 * @example 4321
	 */
	@IsInt()
	@Min(0)
	visits: number;

	constructor(version: string, stats: Stats) {
		this.version = version;
		this.urls = stats.urls;
		this.visits = stats.visits;
	}
}
