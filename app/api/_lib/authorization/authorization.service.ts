import { NextRequest, NextResponse } from 'next/server';
import { AuthenticationService, authenticationService } from '../authentication/authentication.service';
import { Action } from './enums/action.enum';
import { Role } from './enums/role.enum';
import { MissingApiKeyException } from './exceptions/missing-api-key.exception';
import { MissingPermissionsException } from './exceptions/missing-permissions.exception';
import { IncorrectApiKeyException } from '../authentication/exceptions/incorrect-api-key.exception';
import { ExceptionSchema } from '../dtos/exception.dto';

export class AuthorizationService {
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

	assertPermissions(request: NextRequest, ...actions: readonly Action[]): void | NextResponse<ExceptionSchema> {
		try {
			const role = this.authenticationService.getRole(request);

			return AuthorizationService.assertPermissions(role, actions);
		} catch (error) {
			if (
				error instanceof IncorrectApiKeyException ||
				error instanceof MissingApiKeyException ||
				error instanceof MissingPermissionsException
			) {
				return error.toResponse();
			}

			throw error;
		}
	}
}

export const authorizationService = new AuthorizationService(authenticationService);
