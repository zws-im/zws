import { NextResponse } from 'next/server';
import { exceptionRouteWrapper } from '../_lib/exception-route-wrapper';
import { HealthCheckResult } from '../_lib/health/interfaces/health.interface';

export const GET = exceptionRouteWrapper.wrapRoute<HealthCheckResult>(() => {
	return NextResponse.json({ status: 'ok' });
});
