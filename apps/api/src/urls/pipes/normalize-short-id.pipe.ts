import {multiReplace} from '@jonahsnider/util';
import type {PipeTransform} from '@nestjs/common';
import {Injectable} from '@nestjs/common';
import {UrlsConfigService} from '../urls-config.service';
import type {Short} from '../urls.service';

/** Applys the provided character rewrites to the short ID. */
@Injectable()
export class NormalizeShortIdPipe implements PipeTransform<Short, Short> {
	private readonly rewrites: Readonly<Record<string, string>> | undefined;

	constructor(config: UrlsConfigService) {
		this.rewrites = config.shortCharRewrites;
	}

	transform(short: Short) {
		if (this.rewrites) {
			return multiReplace(short, this.rewrites) as Short;
		}

		return short;
	}
}
