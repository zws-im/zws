import { NextResponse } from 'next/server';
import { statsService } from '../../_lib/stats/stats.service';

// rome-ignore lint/nursery/useNamingConvention: Function name is required for Next.js
export async function GET(): Promise<NextResponse> {
	await statsService.savePreciseInstanceStats();

	return new NextResponse();
}
