import type {Hash} from 'node:crypto';
import {createHash, timingSafeEqual} from 'node:crypto';
import type {Buffer} from 'node:buffer';
import {Injectable} from '@nestjs/common';
import {AuthConfig} from './auth.config';
import {Role} from './enums/roles.enum';

@Injectable()
export class AuthService {
	static hashApiKey(apiKey: string): Hash {
		const hash = createHash('sha512');

		hash.update(apiKey);

		return hash;
	}

	/** The hash for the user API key, or `undefined` if the server is not configured to use a user API key. */
	private readonly userApiKeyHash: Buffer | undefined;

	constructor(config: AuthConfig) {
		if (config.userApiKey) {
			this.userApiKeyHash = AuthService.hashApiKey(config.userApiKey).digest();
		}
	}

	/**
	 * @returns The role corresponding to a given API key hash, or `undefined` if the API key is unrecognized (you should throw {@link IncorrectApiKeyException})
	 */
	apiKeyToRole(apiKeyHash: Hash): Role | undefined {
		if (this.userApiKeyHash) {
			// The user API key is configured

			if (timingSafeEqual(apiKeyHash.digest(), this.userApiKeyHash)) {
				// The API key matches the user API key
				return Role.User;
			}

			// The API key doesn't match the user API key
			return undefined;
		}

		// There is no admin API key currently, but if there were you would add an `else if` statement to check for it here
	}

	/**
	 * @returns The default role for unauthenticated users or `undefined` when no default role can be grantedd
	 */
	defaultRole(): Role | undefined {
		return this.userApiKeyHash ? undefined : Role.User;
	}

	bearerToApiKey(header: string): Hash {
		return AuthService.hashApiKey(header.replace(/^bearer /i, ''));
	}

	/**
	 * Check whether the actual role matches the minimum role needed.
	 */
	matchRoles(actualRole: Role, minimumRoleNeeded: Role): boolean {
		/** Keys are a role, values are a set of the roles that have access to it. */
		const rolesAllowedFor: Readonly<Record<Role, ReadonlySet<Role>>> = {
			[Role.Admin]: new Set([Role.Admin]),
			[Role.User]: new Set([Role.User, Role.Admin]),
		};

		return rolesAllowedFor[minimumRoleNeeded].has(actualRole);
	}
}
