import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { BlockedHostnamesModule } from './blocked-hostnames/blocked-hostnames.module.js';
import { BlockedUrlsModule } from './blocked-urls/blocked-urls.module.js';
import { ConfigModule } from './config/config.module.js';
import { DbModule } from './db/db.module.js';
import { HealthModule } from './health/health.module.js';
import { RedisModule } from './redis/redis.module.js';
import { SafeBrowsingModule } from './safe-browsing/safe-browsing.module.js';
import { ShieldsBadgesModule } from './shields-badges/shields-badges.module.js';
import { StatsModule } from './stats/stats.module.js';
import { TrpcModule } from './trpc/trpc.module.js';
import { UrlStatsModule } from './url-stats/url-stats.module.js';
import { UrlsModule } from './urls/urls.module.js';

@Module({
	imports: [
		SentryModule.forRoot(),
		HealthModule,
		ConfigModule,
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
			provide: APP_FILTER,
			useClass: SentryGlobalFilter,
		},
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ZodSerializerInterceptor,
		},
	],
})
export class AppModule {}
