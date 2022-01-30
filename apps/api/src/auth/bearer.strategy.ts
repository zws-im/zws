import {Strategy} from 'passport-http-bearer';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from './auth.service';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super();
	}

	async validate(apiKey: string): Promise<void> {
		const apiKeyHash = AuthService.hashApiKey(apiKey);
		const isValid = this.authService.isApiKeyValid(apiKeyHash);

		if (isValid === false) {
			throw new UnauthorizedException('sneed');
		}
	}
}
