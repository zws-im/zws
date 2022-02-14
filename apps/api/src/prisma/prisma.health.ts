import {Injectable} from '@nestjs/common';
import type {HealthIndicatorResult} from '@nestjs/terminus';
import {HealthIndicator, HealthCheckError} from '@nestjs/terminus';
import {PrismaService} from './prisma.service';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
	constructor(private readonly prismaService: PrismaService) {
		super();
	}

	async isHealthy(key: string): Promise<HealthIndicatorResult> {
		let isHealthy: boolean;
		let prismaError: unknown;

		try {
			await this.prismaService.shortenedUrl.findFirst();
			isHealthy = true;
		} catch (error) {
			isHealthy = false;
			prismaError = error;
		}

		const result = this.getStatus(key, isHealthy, {error: prismaError instanceof Error ? prismaError.message : prismaError});

		if (isHealthy) {
			return result;
		}

		throw new HealthCheckError('Prisma check failed', result);
	}
}
