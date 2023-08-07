import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ExceptionSchema } from '../dtos/exception.dto';
import { QueryBooleanSchema } from '../util/dtos/query-boolean.dto';
import { validateParams, validateQuery } from '../util/validate-request';
import { LongUrlSchema } from './dtos/long-url-dto';
import { ShortSchema } from './dtos/short.dto';
import { UrlBlockedException } from './exceptions/url-blocked.exception';
import { UrlNotFoundException } from './exceptions/url-not-found.exception';
import { urlsService } from './urls.service';

export async function GET(
	request: NextRequest,
	context: { params: { short: string } },
): Promise<NextResponse<LongUrlSchema | ExceptionSchema>> {
	const params = validateParams(context, z.object({ short: ShortSchema }));
	if (params instanceof NextResponse) {
		return params;
	}
	const short = params.short;
	const query = validateQuery(
		request,
		z.object({ visit: QueryBooleanSchema.optional() }),
	);
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
		await urlsService.trackUrlVisit(short);

		redirect(url.longUrl);
	}

	return NextResponse.json({ url: url.longUrl });
}
