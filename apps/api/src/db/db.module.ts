import { Global, Inject, Module, type OnApplicationShutdown } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';
import { ConfigService } from '../config/config.service.js';
import { DB_PROVIDER, POSTGRES_CLIENT_PROVIDER } from './providers.js';
import { relations } from './relations.js';

@Global()
@Module({
	providers: [
		{
			provide: POSTGRES_CLIENT_PROVIDER,
			inject: [ConfigService],
			useFactory: (configService: ConfigService) =>
				postgres(configService.databaseUrl, {
					max: 10,
					connect_timeout: 5,
					idle_timeout: 30,
					connection: {
						application_name: 'zws-api',
						idle_in_transaction_session_timeout: 15_000,
						lock_timeout: 5_000,
						statement_timeout: 15_000,
					},
				}),
		},
		{
			provide: DB_PROVIDER,
			inject: [POSTGRES_CLIENT_PROVIDER],
			useFactory: (client: Sql) => drizzle({ client, relations }),
		},
	],
	exports: [DB_PROVIDER],
})
export class DbModule implements OnApplicationShutdown {
	constructor(@Inject(POSTGRES_CLIENT_PROVIDER) private readonly client: Sql) {}

	async onApplicationShutdown(): Promise<void> {
		await this.client.end({ timeout: 5 });
	}
}
