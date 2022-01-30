import path from 'node:path';
import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AppConfigService} from './app.config';
import {HealthModule} from './health/health.module';
import {HttpExceptionFilter} from './http-exception.filter';
import {LoggerModule} from './logger/logger.module';
import {PrismaModule} from './prisma/prisma.module';
import {StatsModule} from './stats/stats.module';
import {UrlsModule} from './urls/urls.module';
import {AuthModule} from './auth/auth.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			// eslint-disable-next-line unicorn/prefer-module
			envFilePath: [path.join(__dirname, '..', '..', '.env')],
		}),
		LoggerModule,
		PrismaModule,
		HealthModule,
		UrlsModule,
		StatsModule,
		AuthModule,
	],
	controllers: [],
	providers: [AppConfigService, HttpExceptionFilter],
})
export class AppModule {}
