import { NextRequest, NextResponse } from 'next/server';
import { UrlStats } from './interfaces/url-stats.interface';
import { urlStatsService } from './url-stats.service';
import { Short } from '../interfaces/urls.interface';
import { UrlNotFoundException } from './exceptions/url-not-found.exception';
import { ExceptionBody } from '../../exceptions/interfaces/exception.interface';

export async function GET(
	request: NextRequest,
	{ params }: { params: { short: Short } },
): Promise<NextResponse<UrlStats | ExceptionBody>> {
	const short = params.short;
	const stats = await urlStatsService.statsForUrl(short);

	if (!stats) {
		return new UrlNotFoundException().toResponse();
	}

	return NextResponse.json(stats);
}
