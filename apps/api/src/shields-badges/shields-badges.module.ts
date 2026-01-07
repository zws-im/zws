import { Module } from '@nestjs/common';
import { StatsModule } from '../stats/stats.module.js';
import { ShieldsBadgesController } from './shields-badges.controller.js';
import { ShieldsBadgesService } from './shields-badges.service.js';

@Module({
	imports: [StatsModule],
	controllers: [ShieldsBadgesController],
	providers: [ShieldsBadgesService],
})
export class ShieldsBadgesModule {}
