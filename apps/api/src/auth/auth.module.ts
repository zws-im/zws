import { Module } from '@nestjs/common';
import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';

@Module({
	providers: [AuthService, AuthMiddleware],
	exports: [AuthService, AuthMiddleware],
})
export class AuthModule {}
