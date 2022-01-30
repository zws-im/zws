import {Module} from '@nestjs/common';
import {StatsModule} from '../stats/stats.module';
import {AppConfigService} from '../app.config';
import {ShieldsBadgesService} from './shields-badges.service';
import {ShieldsBadgesController} from './shields-badges.controller';

@Module({
	providers: [ShieldsBadgesService, AppConfigService],
	controllers: [ShieldsBadgesController],
	imports: [StatsModule],
})
export class ShieldsBadgesModule {}
