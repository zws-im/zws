import { Inject, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc/trpc.js';
import { LongUrl } from './dtos/long-url.dto.js';
import { UrlsService } from './urls.service.js';

@Injectable()
export class UrlsRouter {
	constructor(@Inject(UrlsService) private readonly urlsService: UrlsService) {}

	createRouter() {
		return router({
			shortenUrl: publicProcedure
				.input(LongUrl)
				.output(z.string().url())
				.mutation(async ({ input }) => {
					const shortened = await this.urlsService.shortenUrl(input.url);

					return decodeURI(shortened.url.toString());
				}),
		});
	}
}
