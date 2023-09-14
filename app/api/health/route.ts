import { NextResponse } from 'next/server';
import { exceptionRouteWrapper } from '../_lib/exception-route-wrapper';
import { HealthCheckResultSchema } from '../_lib/health/dtos/health.dto';

export const GET = exceptionRouteWrapper.wrapRoute<HealthCheckResultSchema>(() => {
	return NextResponse.json({ status: 'ok' });
});
