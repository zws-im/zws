import type {UrlsConfigService} from '../urls-config.service';
import type {Short} from '../urls.service';
import {NormalizeShortIdPipe} from './normalize-short-id.pipe';

describe('NormalizeShortIdPipe', () => {
	it('transforms input', () => {
		const config: Pick<UrlsConfigService, 'shortCharRewrites'> = {
			shortCharRewrites: {
				a: 'x',
				b: 'y',
				z: 'A',
				c: 'z',
			},
		};

		const pipe = new NormalizeShortIdPipe(config as any);

		expect(pipe.transform('abcxyz' as Short)).toBe('xyzxyA');
	});

	it('does nothing when no rewrites are provided', () => {
		const config: Pick<UrlsConfigService, 'shortCharRewrites'> = {
			shortCharRewrites: undefined,
		};

		const pipe = new NormalizeShortIdPipe(config as any);

		expect(pipe.transform('abcxyz' as Short)).toBe('abcxyz');
	});
});
