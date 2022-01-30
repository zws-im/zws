import {Module} from '@nestjs/common';
import {AppConfigService} from '../app.config';
import {PrismaModule} from '../prisma/prisma.module';
import {StatsController} from './stats.controller';
import {StatsService} from './stats.service';

@Module({
	controllers: [StatsController],
	providers: [StatsService, AppConfigService],
	imports: [PrismaModule],
	exports: [StatsService],
})
export class StatsModule {}
