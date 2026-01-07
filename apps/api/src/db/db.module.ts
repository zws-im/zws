import { Global, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { ConfigService } from '../config/config.service.js';
import { Schema } from './index.js';
import { DB_PROVIDER } from './providers.js';

@Global()
@Module({
	providers: [
		{
			provide: DB_PROVIDER,
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const options = { schema: Schema };

				const client = new Client({ connectionString: configService.databaseUrl });
				await client.connect();
				const db = drizzle(client, options);

				return db;
			},
		},
	],
	exports: [DB_PROVIDER],
})
export class DbModule {}
