import { NextResponse } from 'next/server';
import { HealthCheckResult } from './interfaces/health.interface';

export function GET(): NextResponse<HealthCheckResult> {
	return NextResponse.json({ status: 'ok' });
}
