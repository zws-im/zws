import {Module} from '@nestjs/common';
import {TerminusModule} from '@nestjs/terminus';
import {PrismaModule} from '../prisma/prisma.module';
import {HealthController} from './health.controller';

@Module({
	controllers: [HealthController],
	imports: [TerminusModule, PrismaModule],
})
export class HealthModule {}
