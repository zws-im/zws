import {Module} from '@nestjs/common';
import {AuthConfig} from './auth.config';
import {AuthGuard} from './auth.guard';
import {AuthService} from './auth.service';

@Module({
	providers: [AuthService, AuthConfig, AuthGuard],
	exports: [AuthConfig, AuthGuard],
})
export class AuthModule {}
