import type {TestingModule} from '@nestjs/testing';
import {Test} from '@nestjs/testing';
import {plainToInstance} from 'class-transformer';
import {AppConfig} from '../app-config/app.config';
import {FormattedStatsDto} from './dto/formatted-stats.dto';
import {RawStatsDto} from './dto/raw-stats.dto';
import {StatsQueryDto} from './dto/stats-query.dto';
import type {Stats} from './interfaces/stats.interface';
import {StatsController} from './stats.controller';
import {StatsService} from './stats.service';

describe('StatsController', () => {
	const stats: Stats = {urls: 123, visits: 456};

	let controller: StatsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [StatsController],
			providers: [
				{
					provide: StatsService,
					useValue: {
						instanceStats: jest.fn().mockResolvedValue(stats),
					},
				},
				{
					provide: AppConfig,
					useValue: {
						version: '1.0.0',
					},
				},
			],
		}).compile();

		controller = module.get<StatsController>(StatsController);
	});

	describe('stats', () => {
		it('should respond with unformatted stats by default', async (): Promise<void> => {
			const query = plainToInstance(StatsQueryDto, {});

			return expect(controller.stats(query)).resolves.toStrictEqual(new RawStatsDto('1.0.0', stats));
		});

		it('should respond with formatted stats when query params request it', async (): Promise<void> => {
			const query = plainToInstance(StatsQueryDto, {format: true});

			return expect(controller.stats(query)).resolves.toStrictEqual(new FormattedStatsDto('1.0.0', stats));
		});

		it('should respond with unformatted stats when explicitly configured', async (): Promise<void> => {
			const query = plainToInstance(StatsQueryDto, {format: false});

			return expect(controller.stats(query)).resolves.toStrictEqual(new RawStatsDto('1.0.0', stats));
		});
	});
});
