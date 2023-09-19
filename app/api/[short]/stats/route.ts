import { NextResponse } from 'next/server';

import { NextRouteHandlerContext, validateParams } from 'next-api-utils';
import { z } from 'zod';
import { exceptionRouteWrapper } from '../../_lib/exception-route-wrapper';
import { UrlStatsSchema } from '../../_lib/url-stats/dtos/url-stats.dto';
import { urlStatsService } from '../../_lib/url-stats/url-stats.service';
import { ShortSchema } from '../../_lib/urls/dtos/short.dto';
import { UrlNotFoundException } from '../../_lib/urls/exceptions/url-not-found.exception';

export const GET = exceptionRouteWrapper.wrapRoute<UrlStatsSchema, NextRouteHandlerContext<{ short: string }>>(
	async (_request, context) => {
		const params = validateParams(context, z.object({ short: ShortSchema }));

		const short = params.short;

		const stats = await urlStatsService.statsForUrl(short);

		if (!stats) {
			throw new UrlNotFoundException();
		}

		return NextResponse.json(stats);
	},
);
