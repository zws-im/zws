import type { Buffer } from 'node:buffer';
import type { Hash } from 'node:crypto';
import { createHash, timingSafeEqual } from 'node:crypto';
import { NextRequest } from 'next/server';
import { Role } from '../authorization/enums/role.enum';
import { ConfigService, configService } from '../config/config.service';
import { IncorrectApiKeyException } from './exceptions/incorrect-api-key.exception';

export class AuthenticationService {
	private static bearerToApiKey(header: string): Hash {
		return AuthenticationService.hashApiKey(header.replace(/^bearer /i, ''));
	}

	private static hashApiKey(apiKey: string): Hash {
		const hash = createHash('sha512');

		hash.update(apiKey);

		return hash;
	}

	/** The hash for the user API key, or `undefined` if the server is not configured to use a user API key. */
	private readonly userApiKeyHash: Buffer | undefined;

	constructor(config: ConfigService) {
		if (config.userApiKey) {
			this.userApiKeyHash = AuthenticationService.hashApiKey(config.userApiKey).digest();
		}
	}

	getRole(request: NextRequest): Role {
		if (!this.userApiKeyHash) {
			// If there is no API key configured, provide a default role
			return Role.User;
		}

		const authorizationHeader = request.headers.get('authorization');

		if (!authorizationHeader) {
			// No authorization header means no role
			return Role.None;
		}

		const hash = AuthenticationService.bearerToApiKey(authorizationHeader);

		if (timingSafeEqual(hash.digest(), this.userApiKeyHash)) {
			return Role.User;
		}

		// If the hashes don't match, throw an error
		throw new IncorrectApiKeyException();
	}
}

export const authenticationService = new AuthenticationService(configService);
