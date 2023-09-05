import { NextResponse } from 'next/server';
import { exceptionRouteWrapper } from '../../_lib/exception-route-wrapper';
import { statsService } from '../../_lib/stats/stats.service';

export const GET = exceptionRouteWrapper.wrapRoute<never>(async () => {
	await statsService.savePreciseInstanceStats();

	return new NextResponse();
});
