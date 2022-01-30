import {Logger, Module} from '@nestjs/common';
import {AuthModule} from '../auth/auth.module';
import {PrismaModule} from '../prisma/prisma.module';
import {UrlsConfigService} from './urls-config.service';
import {UrlsController} from './urls.controller';
import {UrlsService} from './urls.service';

@Module({
	controllers: [UrlsController],
	providers: [UrlsService, UrlsConfigService, Logger],
	imports: [PrismaModule, AuthModule],
})
export class UrlsModule {}
