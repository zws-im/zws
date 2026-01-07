import { HttpException, type INestApplication, Inject, Injectable, Logger } from '@nestjs/common';
import { captureException } from '@sentry/bun';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import { ConfigService } from '../config/config.service.js';
import { AppRouter } from './app.router.js';

@Injectable()
export class TrpcService {
	private readonly logger = new Logger(TrpcService.name);

	constructor(
		@Inject(AppRouter) private readonly appRouter: AppRouter,
		@Inject(ConfigService) private readonly configService: ConfigService,
	) {}

	register(app: INestApplication) {
		app.use(
			'/trpc',
			cors({
				origin: this.configService.websiteUrl,
			}),
			trpcExpress.createExpressMiddleware({
				router: this.appRouter.createRouter(),
				onError: (options) => {
					if (options.error.cause instanceof HttpException) {
						if (options.error.cause.getStatus() < 500) {
							// Client side error, expose this to the user

							options.error.message = options.error.cause.message;
							options.error.stack = undefined;
						}
					} else if (options.error.code === 'INTERNAL_SERVER_ERROR') {
						// Log error and have tRPC respond like normal
						this.logger.error(options.error);
						captureException(options.error);

						// Avoid leaking sensitive info
						options.error.message = 'Internal server error';
						options.error.stack = undefined;
					}

					// Ignore otherwise, client-side error
				},
			}),
		);
	}
}
