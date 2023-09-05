import { NextResponse } from 'next/server';

import { NextRouteHandlerContext, validateParams } from '@jonahsnider/nextjs-api-utils';
import { z } from 'zod';
import { UrlStatsSchema } from '../../_lib/url-stats/dtos/url-stats.dto';
import { urlStatsService } from '../../_lib/url-stats/url-stats.service';
import { ShortSchema } from '../../_lib/urls/dtos/short.dto';
import { UrlNotFoundException } from '../../_lib/urls/exceptions/url-not-found.exception';
import { Short } from '../../_lib/urls/interfaces/urls.interface';
import { exceptionRouteWrapper } from '../../exception-route-wrapper';

export const GET = exceptionRouteWrapper.wrapRoute<UrlStatsSchema, NextRouteHandlerContext<{ short: string }>>(
	async (_request, context) => {
		const params = validateParams(context, z.object({ short: ShortSchema }));

		const short = decodeURIComponent(params.short) as Short;

		const stats = await urlStatsService.statsForUrl(short);

		if (!stats) {
			throw new UrlNotFoundException();
		}

		return NextResponse.json(stats);
	},
);
