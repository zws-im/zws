import {Module} from '@nestjs/common';
import {AppConfigModule} from '../app-config/app-config.module';
import {StatsModule} from '../stats/stats.module';
import {ShieldsBadgesController} from './shields-badges.controller';
import {ShieldsBadgesService} from './shields-badges.service';

@Module({
	imports: [AppConfigModule, StatsModule],
	providers: [ShieldsBadgesService],
	controllers: [ShieldsBadgesController],
})
export class ShieldsBadgesModule {}
