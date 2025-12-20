import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { ConfigService } from '../config/config.service';
import { REDIS_PROVIDER } from './providers';

@Global()
@Module({
	providers: [
		{
			provide: REDIS_PROVIDER,
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const client = createClient({
					url: configService.redisUrl,
				});
				return client.connect();
			},
		},
	],
	exports: [REDIS_PROVIDER],
})
export class RedisModule {}
