import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import type {EnvironmentVariables} from '../interfaces/config.interface';

@Injectable()
export class AuthConfigService {
	readonly apiKey: string | undefined;

	constructor(private readonly configService: ConfigService<EnvironmentVariables>) {
		this.apiKey = this.getApiKey();
	}

	private getApiKey(): string | undefined {
		return this.configService.get('API_KEY');
	}
}
