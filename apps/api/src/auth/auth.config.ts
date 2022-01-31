import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import type {EnvironmentVariables} from '../interfaces/config.interface';

@Injectable()
export class AuthConfigService {
	/**
	 * The API key for regular users.
	 * In the future an admin API key may also be configured, which is why there is a distinction.
	 */
	readonly userApiKey: string | undefined;

	constructor(private readonly configService: ConfigService<EnvironmentVariables>) {
		this.userApiKey = this.getUserApiKey();
	}

	private getUserApiKey(): string | undefined {
		return this.configService.get('API_KEY');
	}
}
