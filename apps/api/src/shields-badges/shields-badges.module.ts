import { Module } from '@nestjs/common';
import { StatsModule } from '../stats/stats.module';
import { ShieldsBadgesController } from './shields-badges.controller';
import { ShieldsBadgesService } from './shields-badges.service';

@Module({
	imports: [StatsModule],
	controllers: [ShieldsBadgesController],
	providers: [ShieldsBadgesService],
})
export class ShieldsBadgesModule {}
