import { NextRequest } from 'next/server';
import { AuthenticationService, authenticationService } from '../authentication/authentication.service';
import { Action } from './enums/action.enum';
import { Role } from './enums/role.enum';
import { MissingApiKeyException } from './exceptions/missing-api-key.exception';
import { MissingPermissionsException } from './exceptions/missing-permissions.exception';

class AuthorizationService {
	private static readonly policies: Readonly<Record<Role, ReadonlySet<Action>>> = {
		[Role.Admin]: new Set([Action.ShortenUrl]),
		[Role.User]: new Set([Action.ShortenUrl]),
		[Role.None]: new Set(),
	};

	private static assertPermissions(role: Role, actions: readonly Action[]): void {
		for (const action of actions) {
			if (!this.hasPermission(role, action)) {
				if (role === Role.None) {
					throw new MissingApiKeyException();
				}

				throw new MissingPermissionsException();
			}
		}
	}

	private static hasPermission(role: Role, action: Action): boolean {
		return this.policies[role].has(action);
	}

	constructor(private readonly authenticationService: AuthenticationService) {}

	assertPermissions(request: NextRequest, ...actions: readonly Action[]): void {
		const role = this.authenticationService.getRole(request);

		AuthorizationService.assertPermissions(role, actions);
	}
}

export const authorizationService = new AuthorizationService(authenticationService);
