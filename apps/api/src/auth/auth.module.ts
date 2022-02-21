import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {LoggerModule} from '../logger/logger.module';
import {AuthConfig} from './auth.config';
import {AuthGuard} from './auth.guard';
import {AuthService} from './auth.service';

@Module({
	imports: [ConfigModule, LoggerModule],
	providers: [AuthService, AuthConfig, AuthGuard],
	exports: [AuthGuard, AuthService],
})
export class AuthModule {}
