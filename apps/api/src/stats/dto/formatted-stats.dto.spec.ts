import {instanceToPlain} from 'class-transformer';
import {FormattedStatsDto} from './formatted-stats.dto';

describe('FormattedStatsDto', () => {
	describe('constructor', () => {
		it('should copy provided values over without modifying them', () => {
			const dto = new FormattedStatsDto('1.0.0', {urls: 123_456, visits: 456_123});

			expect(instanceToPlain(dto)).toStrictEqual({
				version: 'v1.0.0',
				urls: '123,456',
				visits: '456,123',
			});
		});
	});
});
