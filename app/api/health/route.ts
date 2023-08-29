import { NextResponse } from 'next/server';
import { HealthCheckResult } from '../_lib/health/interfaces/health.interface';

export function GET(): NextResponse<HealthCheckResult> {
	return NextResponse.json({ status: 'ok' });
}
