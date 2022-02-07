import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {APP_GUARD} from '@nestjs/core';
import {AuthConfig} from './auth.config';
import {AuthGuard} from './auth.guard';
import {AuthService} from './auth.service';

@Module({
	imports: [ConfigModule],
	providers: [
		AuthService,
		AuthConfig,
		AuthGuard,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
	exports: [AuthConfig, AuthGuard],
})
export class AuthModule {}
