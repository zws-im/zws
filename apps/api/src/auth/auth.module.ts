import {Module} from '@nestjs/common';
import {AuthConfigService} from './auth.config';
import {AuthGuard} from './auth.guard';
import {AuthService} from './auth.service';

@Module({
	providers: [AuthService, AuthConfigService, AuthGuard],
	exports: [AuthService, AuthGuard, AuthConfigService],
})
export class AuthModule {}
