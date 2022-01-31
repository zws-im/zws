import path from 'node:path';
import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {APP_GUARD} from '@nestjs/core';
import {AppConfigService} from './app.config';
import {HealthModule} from './health/health.module';
import {HttpExceptionFilter} from './filters/http-exception.filter';
import {LoggerModule} from './logger/logger.module';
import {PrismaModule} from './prisma/prisma.module';
import {StatsModule} from './stats/stats.module';
import {UrlsModule} from './urls/urls.module';
import {AuthModule} from './auth/auth.module';
import {ShieldsBadgesModule} from './shields-badges/shields-badges.module';
import {AuthGuard} from './auth/auth.guard';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				// .env relative to this source file
				// eslint-disable-next-line unicorn/prefer-module
				path.join(__dirname, '..', '..', '.env'),
				// .env relative to this file compiled to dist/src/
				// eslint-disable-next-line unicorn/prefer-module
				path.join(__dirname, '..', '..', '..', '..', '.env'),
			],
		}),
		LoggerModule,
		AuthModule,
		PrismaModule,
		HealthModule,
		StatsModule,
		ShieldsBadgesModule,
		// UrlsModule goes last since its controller has a /:id route which is rather broad
		UrlsModule,
	],
	controllers: [],
	providers: [
		AppConfigService,
		HttpExceptionFilter,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AppModule {}
