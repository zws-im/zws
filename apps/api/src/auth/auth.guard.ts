import type {ExecutionContext} from '@nestjs/common';
import {Inject, Injectable} from '@nestjs/common';
import {AuthGuard as BaseAuthGuard} from '@nestjs/passport';
import type {Observable} from 'rxjs';
import {AuthConfigService} from './auth.config';

@Injectable()
export class AuthGuard extends BaseAuthGuard('bearer') {
	private readonly tokenExists: boolean;

	constructor(@Inject(AuthConfigService) config: AuthConfigService) {
		super();

		this.tokenExists = config.apiKey !== undefined;
	}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		if (this.tokenExists) {
			return super.canActivate(context);
		}

		return false;
	}
}
