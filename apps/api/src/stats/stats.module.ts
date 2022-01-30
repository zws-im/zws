import {Module} from '@nestjs/common';
import {StatsController} from './stats.controller';
import {StatsService} from './stats.service';

@Module({
	controllers: [StatsController],
	providers: [StatsService],
})
export class StatsModule {}
