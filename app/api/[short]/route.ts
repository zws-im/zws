import { NextRouteHandlerContext, QueryBooleanSchema, validateParams, validateQuery } from 'next-api-utils';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { exceptionRouteWrapper } from '../_lib/exception-route-wrapper';
import { urlStatsService } from '../_lib/url-stats/url-stats.service';
import { LongUrlSchema } from '../_lib/urls/dtos/long-url.dto';
import { ShortSchema } from '../_lib/urls/dtos/short.dto';
import { UrlBlockedException } from '../_lib/urls/exceptions/url-blocked.exception';
import { UrlNotFoundException } from '../_lib/urls/exceptions/url-not-found.exception';
import { urlsService } from '../_lib/urls/urls.service';

export const GET = exceptionRouteWrapper.wrapRoute<LongUrlSchema, NextRouteHandlerContext<{ short: string }>>(
	async (request, context) => {
		const params = validateParams(context, z.object({ short: ShortSchema }));
		const short = params.short;
		const query = validateQuery(request, z.object({ visit: QueryBooleanSchema.optional() }));

		const url = await urlsService.retrieveUrl(short);

		if (!url) {
			throw new UrlNotFoundException();
		}

		if (url.blocked) {
			throw new UrlBlockedException();
		}

		if (query.visit !== false) {
			await urlStatsService.trackUrlVisit(short);

			redirect(encodeURI(url.longUrl));
		}

		return NextResponse.json({ url: url.longUrl });
	},
);
