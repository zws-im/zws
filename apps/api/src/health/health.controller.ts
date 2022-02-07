import {Controller, Get} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import type {HealthCheckResult} from '@nestjs/terminus';
import {HealthCheck, HealthCheckService} from '@nestjs/terminus';
import {PrismaHealthIndicator} from '../prisma/prisma.health';

@ApiTags('health')
@Controller('health')
export class HealthController {
	constructor(private readonly health: HealthCheckService, private readonly prismaHealthIndicator: PrismaHealthIndicator) {}

	@Get()
	@HealthCheck()
	async check(): Promise<HealthCheckResult> {
		return this.health.check([async () => this.prismaHealthIndicator.isHealthy('database')]);
	}
}
