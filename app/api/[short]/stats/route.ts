import { NextRequest, NextResponse } from 'next/server';

import { validateParams } from '../../util/validate-request';
import { ShortSchema } from '../dtos/short.dto';
import { UrlNotFoundException } from '../exceptions/url-not-found.exception';
import { UrlStats } from './dtos/url-stats.dto';
import { urlStatsService } from './url-stats.service';
import { ExceptionSchema } from '../../dtos/exception.dto';
import { z } from 'zod';

export async function GET(
	request: NextRequest,
	context: { params: { short: string } },
): Promise<NextResponse<UrlStats | ExceptionSchema>> {
	const params = validateParams(context, z.object({ short: ShortSchema }));
	if (params instanceof NextResponse) {
		return params;
	}
	const stats = await urlStatsService.statsForUrl(params.short);

	if (!stats) {
		return new UrlNotFoundException().toResponse();
	}

	return NextResponse.json(stats);
}
