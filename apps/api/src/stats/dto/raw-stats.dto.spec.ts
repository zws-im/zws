import {instanceToPlain} from 'class-transformer';
import {RawStatsDto} from './raw-stats.dto';

describe('RawStatsDto', () => {
	describe('constructor', () => {
		it('should copy provided values over without modifying them', () => {
			const dto = new RawStatsDto('1.0.0', {urls: 123, visits: 456});

			expect(instanceToPlain(dto)).toStrictEqual({
				version: '1.0.0',
				urls: 123,
				visits: 456,
			});
		});
	});
});
