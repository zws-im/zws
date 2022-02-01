import {instanceToPlain} from 'class-transformer';
import {ShieldsResponseDto} from './shields-response.dto';

describe('ShieldsResponseDto', () => {
	describe('constructor', () => {
		it('copies options', () => {
			const dto = new ShieldsResponseDto({label: 'abc', message: 'xyz', color: 'informational'});

			expect(instanceToPlain(dto)).toStrictEqual({
				schemaVersion: 1,
				label: 'abc',
				message: 'xyz',
				color: 'informational',
			});
		});
	});
});
