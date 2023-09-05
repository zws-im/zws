import { NextResponse } from 'next/server';
import { HealthCheckResult } from '../_lib/health/interfaces/health.interface';

// rome-ignore lint/nursery/useNamingConvention: Function name is required for Next.js
export function GET(): NextResponse<HealthCheckResult> {
	return NextResponse.json({ status: 'ok' });
}
