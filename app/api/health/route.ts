import { NextResponse } from 'next/server';
import { HealthCheckResult } from '../_lib/health/interfaces/health.interface';
import { exceptionRouteWrapper } from '../exception-route-wrapper';

export const GET = exceptionRouteWrapper.wrapRoute<HealthCheckResult>(() => {
	return NextResponse.json({ status: 'ok' });
});
