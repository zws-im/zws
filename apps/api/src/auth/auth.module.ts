import {Module} from '@nestjs/common';
import {AuthConfigService} from './auth.config';
import {AuthGuard} from './auth.guard';
import {AuthService} from './auth.service';
import {BearerStrategy} from './bearer.strategy';

@Module({
	providers: [AuthService, AuthConfigService, BearerStrategy, AuthGuard],
})
export class AuthModule {}
