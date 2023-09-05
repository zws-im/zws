import { NextResponse } from 'next/server';
import { statsService } from '../../_lib/stats/stats.service';
import { exceptionRouteWrapper } from '../../exception-route-wrapper';

export const GET = exceptionRouteWrapper.wrapRoute<never>(async () => {
	await statsService.savePreciseInstanceStats();

	return new NextResponse();
});
