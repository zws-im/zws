import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { ZodValidationPipe } from 'nestjs-zod';
import { BlockedHostnamesModule } from './blocked-hostnames/blocked-hostnames.module';
import { BlockedUrlsModule } from './blocked-urls/blocked-urls.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { DbModule } from './db/db.module';
import { HealthModule } from './health/health.module';
import { OpenapiModule } from './openapi/openapi.module';
import { RedisModule } from './redis/redis.module';
import { SafeBrowsingModule } from './safe-browsing/safe-browsing.module';
import { ShieldsBadgesModule } from './shields-badges/shields-badges.module';
import { StatsModule } from './stats/stats.module';
import { TrpcModule } from './trpc/trpc.module';
import { UrlStatsModule } from './url-stats/url-stats.module';
import { UrlsModule } from './urls/urls.module';

@Module({
	imports: [
		HealthModule,
		OpenapiModule,
		ConfigModule,
		SentryModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				dsn: config.sentryDsn,
				environment: config.nodeEnv,
			}),
		}),
		DbModule,
		RedisModule,
		StatsModule,
		TrpcModule,
		BlockedHostnamesModule,
		UrlStatsModule,
		UrlsModule,
		ShieldsBadgesModule,
		SafeBrowsingModule,
		BlockedUrlsModule,
	],
	providers: [
		{
			provide: APP_PIPE,
			useValue: new ZodValidationPipe(),
		},
	],
})
export class AppModule {}
