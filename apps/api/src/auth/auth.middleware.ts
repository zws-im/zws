import { Inject, Injectable, type NestMiddleware, UnauthorizedException } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(@Inject(AuthService) private readonly authService: AuthService) {}

	use(request: Request, response: Response, next: NextFunction) {
		response.setHeader('WWW-Authenticate', 'Basic realm="realm", charset="UTF-8"');

		const authHeader = request.headers.authorization;

		if (!authHeader) {
			throw new UnauthorizedException('Missing Authorization header');
		}

		const [type, credentials] = authHeader.split(' ');

		if (type !== 'Basic') {
			throw new UnauthorizedException('Invalid Authorization type');
		}

		if (!credentials) {
			throw new UnauthorizedException('Missing credentials');
		}

		const [username, password] = Buffer.from(credentials, 'base64').toString().split(':');

		if (!username) {
			throw new UnauthorizedException('Missing username');
		}

		if (!password) {
			throw new UnauthorizedException('Missing password');
		}

		this.authService.assertBasicAuth(username, password);

		next();
	}
}
