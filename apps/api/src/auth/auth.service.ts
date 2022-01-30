import type {Hash} from 'node:crypto';
import {createHash, timingSafeEqual} from 'node:crypto';
import type {Buffer} from 'node:buffer';
import {Injectable} from '@nestjs/common';
import {AuthConfigService} from './auth.config';

@Injectable()
export class AuthService {
	static hashApiKey(apiKey: string): Hash {
		const hash = createHash('sha512');

		hash.update(apiKey);

		return hash;
	}

	private readonly apiKeyHash: Buffer | undefined;

	constructor(config: AuthConfigService) {
		if (config.apiKey !== undefined) {
			this.apiKeyHash = AuthService.hashApiKey(config.apiKey).digest();
		}
	}

	/**
	 * @returns Whether the API key was valid, or `undefined` if the server is not configured with a valid API key
	 */
	isApiKeyValid(apiKey: Hash): boolean | undefined {
		if (this.apiKeyHash) {
			return timingSafeEqual(apiKey.digest(), this.apiKeyHash);
		}

		return undefined;
	}
}
