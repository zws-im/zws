import { Global, Module } from '@nestjs/common';
import Ioredis from 'ioredis';
import { ConfigService } from '../config/config.service';
import { REDIS_PROVIDER } from './providers';

@Global()
@Module({
	providers: [
		{
			provide: REDIS_PROVIDER,
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => new Ioredis(configService.redisUrl),
		},
	],
	exports: [REDIS_PROVIDER],
})
export class RedisModule {}
