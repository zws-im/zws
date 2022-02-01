import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import path from 'node:path';
import {AppConfigService} from './app.config';
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
	providers: [AppConfigService, HttpExceptionFilter],
})
export class AppModule {}
