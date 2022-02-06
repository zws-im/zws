import {Module} from '@nestjs/common';
import {AppConfigModule} from '../app-config/app-config.module';
import {PrismaModule} from '../prisma/prisma.module';
import {StatsController} from './stats.controller';
import {StatsService} from './stats.service';

@Module({
	imports: [PrismaModule, AppConfigModule],
	providers: [StatsService],
	controllers: [StatsController],
	exports: [StatsService],
})
export class StatsModule {}
