import {Logger, Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AuthModule} from '../auth/auth.module';
import {PrismaModule} from '../prisma/prisma.module';
import {UrlsConfigService} from './urls-config.service';
import {UrlsController} from './urls.controller';
import {UrlsService} from './urls.service';

@Module({
	imports: [PrismaModule, AuthModule, ConfigModule],
	providers: [UrlsService, UrlsConfigService, Logger],
	controllers: [UrlsController],
})
export class UrlsModule {}
