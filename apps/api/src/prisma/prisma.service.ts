import type {OnModuleInit} from '@nestjs/common';
import {Injectable} from '@nestjs/common';
import type {Prisma} from '@prisma/client';
import {PrismaClient} from '@prisma/client';
import * as Sentry from '@sentry/node';
import type {Logger} from '../logger/interfaces/logger.interface';
import {LoggerService} from '../logger/logger.service';
import {PrismaException} from './exceptions/prisma.exception';
import type {BuggedPrismaLogEvent} from './interfaces/bugged-prisma-log-event.interface';

@Injectable()
export class PrismaService
	extends PrismaClient<
		{
			log: Array<{level: 'error'; emit: 'event'} | {level: 'info'; emit: 'event'} | {level: 'warn'; emit: 'event'}>;
		},
		'info' | 'warn' | 'error',
		false
	>
	implements OnModuleInit
{
	private readonly logger: Logger;

	constructor(logger: LoggerService) {
		super({
			log: [
				{level: 'error', emit: 'event'},
				{level: 'info', emit: 'event'},
				{level: 'warn', emit: 'event'},
			],
		});

		this.logger = logger.createLogger().withTag('prisma');

		this.$on('error', this.onError.bind(this));
		this.$on('warn', this.onWarn.bind(this));
		this.$on('info', this.onInfo.bind(this));
	}

	async onModuleInit(): Promise<void> {
		await this.$connect();
	}

	private async onError(event: Prisma.LogEvent | BuggedPrismaLogEvent) {
		const logger = this.createLoggerForEvent(event);

		const error = new PrismaException(event);
		logger.error(error);
		Sentry.captureException(error);
	}

	private async onWarn(event: Prisma.LogEvent | BuggedPrismaLogEvent) {
		const logger = this.createLoggerForEvent(event);

		const warning = new PrismaException(event);

		logger.warn(warning);
		Sentry.addBreadcrumb({
			category: 'prisma.warning',
			level: 'warning',
			message: warning.message,
			timestamp: warning.timestamp.getTime() * 1000,
			data: {
				target: warning.target,
			},
		});
	}

	private async onInfo(event: Prisma.LogEvent | BuggedPrismaLogEvent) {
		const logger = this.createLoggerForEvent(event);

		logger.info(event.message);
		Sentry.addBreadcrumb({
			category: 'prisma.info',
			level: 'info',
			message: event.message,
			timestamp: (event.timestamp?.getTime() ?? Date.now()) * 1000,
			data: {
				target: event.target,
			},
		});
	}

	private createLoggerForEvent(event: Prisma.LogEvent | BuggedPrismaLogEvent): Logger {
		if (event.target) {
			return this.logger.withTag(event.target);
		}

		return this.logger;
	}
}
