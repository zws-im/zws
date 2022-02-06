import type {INestApplication, OnModuleInit} from '@nestjs/common';
import {Injectable} from '@nestjs/common';
import type {Prisma} from '@prisma/client';
import {PrismaClient} from '@prisma/client';
import type {Logger} from '../logger/interfaces/logger.interface';
import {LoggerService} from '../logger/logger.service';
import {PrismaException} from './exceptions/prisma.exception';

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

		this.logger = logger.createLogger().withTag('database');

		this.$on('error', this.onError.bind(this));
		this.$on('warn', this.onWarn.bind(this));
		this.$on('info', this.onInfo.bind(this));
	}

	async onModuleInit(): Promise<void> {
		await this.$connect();
	}

	/**
	 * @see https://docs.nestjs.com/recipes/prisma#issues-with-enableshutdownhooks
	 */
	enableShutdownHooks(app: INestApplication): void {
		this.$on('beforeExit', async (): Promise<void> => app.close());
	}

	private async onError(event: Prisma.LogEvent) {
		const logger = this.createLoggerForEvent(event);

		const error = new PrismaException(event);
		logger.error(error);
	}

	private async onWarn(event: Prisma.LogEvent) {
		const logger = this.createLoggerForEvent(event);

		const warning = new PrismaException(event);

		logger.warn(warning);
	}

	private async onInfo(event: Prisma.LogEvent) {
		const logger = this.createLoggerForEvent(event);

		logger.info(event.message);
	}

	private createLoggerForEvent(event: Prisma.LogEvent): Logger {
		if (event.target) {
			return this.logger.withTag(event.target);
		}

		return this.logger;
	}
}
