import type {INestApplication, OnModuleInit} from '@nestjs/common';
import {Injectable} from '@nestjs/common';
import {PrismaClient} from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	async onModuleInit(): Promise<void> {
		await this.$connect();
	}

	/**
	 * @see https://docs.nestjs.com/recipes/prisma#issues-with-enableshutdownhooks
	 */
	enableShutdownHooks(app: INestApplication): void {
		this.$on('beforeExit', async () => {
			await app.close();
		});
	}
}
