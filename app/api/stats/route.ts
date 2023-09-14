import { StatsSchema } from '@/app/api/_lib/stats/dtos/stats.dto';
import { statsService } from '@/app/api/_lib/stats/stats.service';
import { NextResponse } from 'next/server';
import { exceptionRouteWrapper } from '../_lib/exception-route-wrapper';

export const GET = exceptionRouteWrapper.wrapRoute<StatsSchema>(async () => {
	const stats = await statsService.getInstanceStats();

	return NextResponse.json(stats);
});
