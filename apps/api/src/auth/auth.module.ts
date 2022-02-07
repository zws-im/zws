import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AuthConfig} from './auth.config';
import {AuthGuard} from './auth.guard';
import {AuthService} from './auth.service';

@Module({
	imports: [ConfigModule],
	providers: [AuthService, AuthConfig, AuthGuard],
	exports: [AuthGuard, AuthService],
})
export class AuthModule {}
