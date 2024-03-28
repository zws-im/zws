import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AuthService {
	constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

	assertBasicAuth(username: string, password: string): void {
		if (username !== this.configService.adminUsername || password !== this.configService.adminApiToken) {
			throw new ForbiddenException('Invalid username or password');
		}
	}
}
