import {applyDecorators, SetMetadata} from '@nestjs/common';
import {ApiBearerAuth, ApiExtraModels, ApiForbiddenResponse, ApiUnauthorizedResponse, getSchemaPath} from '@nestjs/swagger';
import type {Role} from '../enums/roles.enum';
import {IncorrectApiKeyException} from '../exceptions/incorrect-api-key.exception';
import {MissingApiKeyException} from '../exceptions/missing-api-key.exception';
import {MissingPermissionsException} from '../exceptions/missing-permissions.exception';

/**
 * Sets the minimum role needed to access the decorated route.
 * Also includes the relevant OpenAPI decorators to document the security requirements for the route.
 *
 * By default routes are set to public and can be accessed by anyone.
 *
 * @param role - The minimum role required to access the route
 */
export const MinimumRoleNeeded = (role: Role) =>
	applyDecorators(
		SetMetadata('roles', role),

		ApiBearerAuth(),

		ApiForbiddenResponse({type: MissingPermissionsException}),
		ApiUnauthorizedResponse({type: IncorrectApiKeyException}),
		ApiExtraModels(MissingApiKeyException, IncorrectApiKeyException),
		ApiUnauthorizedResponse({
			schema: {
				oneOf: [{$ref: getSchemaPath(MissingApiKeyException)}, {$ref: getSchemaPath(IncorrectApiKeyException)}],
			},
		}),
	);
