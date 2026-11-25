import { Global, Inject, Module, type OnApplicationShutdown } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres';
import { ConfigService } from '../config/config.service.js';
import type { Db } from './interfaces/db.interface.js';
import { DB_PROVIDER } from './providers.js';
import { relations } from './relations.js';

@Global()
@Module({
	providers: [
		{
			provide: DB_PROVIDER,
			inject: [ConfigService],
			useFactory: (configService: ConfigService) =>
				drizzle({
					connection: {
						url: configService.databaseUrl,
						max: 10,
						connectTimeout: 5_000,
						idleTimeoutMillis: 30_000,
						applicationName: 'zws-api',
						idleInTransactionSessionTimeout: 15_000,
						options: '-c lock_timeout=5000',
						statementTimeout: 15_000,
					},
					relations,
				}),
		},
	],
	exports: [DB_PROVIDER],
})
export class DbModule implements OnApplicationShutdown {
	constructor(@Inject(DB_PROVIDER) private readonly db: Db) {}

	async onApplicationShutdown(): Promise<void> {
		await this.db.$client.end();
	}
}
