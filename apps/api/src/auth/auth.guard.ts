import type {CanActivate, ExecutionContext} from '@nestjs/common';
import {Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import type {Request} from 'express';
import {AuthService} from './auth.service';
import type {Role} from './enums/roles.enum';
import {IncorrectApiKeyException} from './exceptions/incorrect-api-key.exception';
import {MissingApiKeyException} from './exceptions/missing-api-key.exception';
import {MissingPermissionsException} from './exceptions/missing-permissions.exception';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly reflector: Reflector, private readonly service: AuthService) {}

	canActivate(context: ExecutionContext): boolean {
		const minimumRoleNeeded = this.reflector.get<Role | undefined>('roles', context.getHandler());

		if (!minimumRoleNeeded) {
			// Route is public to everyone
			return true;
		}

		const request = context.switchToHttp().getRequest<Request>();
		const authorizationHeader = request.headers.authorization;

		let role: Role | undefined = this.service.defaultRole();

		if (authorizationHeader) {
			const apiKeyHash = this.service.bearerToApiKey(authorizationHeader);

			if (apiKeyHash) {
				const calculatedRole = this.service.apiKeyToRole(apiKeyHash);

				if (calculatedRole) {
					role = calculatedRole;
				} else {
					// Note that if the server does not have an API key configured (so the default role is present) this will still throw if any API key is provided
					// This is deliberately done in the implementation of AuthService.apiKeyToRole()
					throw new IncorrectApiKeyException();
				}
			}
		}

		if (!role) {
			throw new MissingApiKeyException();
		}

		if (this.service.matchRoles(role, minimumRoleNeeded)) {
			return true;
		}

		throw new MissingPermissionsException();
	}
}
