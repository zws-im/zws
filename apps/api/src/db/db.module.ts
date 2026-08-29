import { Global, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { ConfigService } from '../config/config.service.js';
import { DB_PROVIDER } from './providers.js';
import { relations } from './relations.js';

@Global()
@Module({
	providers: [
		{
			provide: DB_PROVIDER,
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const client = new Client({ connectionString: configService.databaseUrl });
				await client.connect();
				const db = drizzle({ client, relations });

				return db;
			},
		},
	],
	exports: [DB_PROVIDER],
})
export class DbModule {}
