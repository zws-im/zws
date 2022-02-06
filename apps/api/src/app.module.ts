import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import path from 'node:path';
import {AppConfigModule} from './app-config/app-config.module';
import {AuthModule} from './auth/auth.module';
import {HttpExceptionFilter} from './filters/http-exception.filter';
import {HealthModule} from './health/health.module';
import {LoggerModule} from './logger/logger.module';
import {PrismaModule} from './prisma/prisma.module';
import {ShieldsBadgesModule} from './shields-badges/shields-badges.module';
import {StatsModule} from './stats/stats.module';
import {UrlsModule} from './urls/urls.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				/* eslint-disable unicorn/prefer-module */
				// .env relative to this source file
				path.join(__dirname, '..', '..', '.env'),
				// .env relative to this file compiled to dist/src/
				path.join(__dirname, '..', '..', '..', '..', '.env'),
				/* eslint-enable unicorn/prefer-module */
			],
		}),
		AppConfigModule,
		LoggerModule,
		AuthModule,
		PrismaModule,
		HealthModule,
		StatsModule,
		ShieldsBadgesModule,
		// UrlsModule goes last since its controller has a /:id route which is rather broad
		UrlsModule,
	],
	providers: [HttpExceptionFilter],
})
export class AppModule {}
