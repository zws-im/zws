import {Module} from '@nestjs/common';
import {LoggerModule} from '../logger/logger.module';
import {PrismaHealthIndicator} from './prisma.health';
import {PrismaService} from './prisma.service';

@Module({
	imports: [LoggerModule],
	providers: [PrismaService, PrismaHealthIndicator],
	exports: [PrismaService, PrismaHealthIndicator],
})
export class PrismaModule {}
