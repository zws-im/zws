import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ExceptionSchema } from '../_lib/dtos/exception.dto';
import { LongUrlSchema } from '../_lib/urls/dtos/long-url-dto';
import { ShortSchema } from '../_lib/urls/dtos/short.dto';
import { UrlBlockedException } from '../_lib/urls/exceptions/url-blocked.exception';
import { UrlNotFoundException } from '../_lib/urls/exceptions/url-not-found.exception';
import { urlsService } from '../_lib/urls/urls.service';
import { QueryBooleanSchema } from '../_lib/util/dtos/query-boolean.dto';
import { validateParams, validateQuery } from '../_lib/util/validate-request';
import { urlStatsService } from '../_lib/url-stats/url-stats.service';

export async function GET(
	request: NextRequest,
	context: { params: { short: string } },
): Promise<NextResponse<LongUrlSchema | ExceptionSchema>> {
	const params = validateParams(context, z.object({ short: ShortSchema }));
	if (params instanceof NextResponse) {
		return params;
	}
	const short = params.short;
	const query = validateQuery(request, z.object({ visit: QueryBooleanSchema.optional() }));
	if (query instanceof NextResponse) {
		return query;
	}

	const url = await urlsService.retrieveUrl(short);

	if (!url) {
		return new UrlNotFoundException().toResponse();
	}

	if (url.blocked) {
		return new UrlBlockedException().toResponse();
	}

	if (query.visit) {
		await urlStatsService.trackUrlVisit(short);

		redirect(url.longUrl);
	}

	return NextResponse.json({ url: url.longUrl });
}
