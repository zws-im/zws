import { NextResponse } from 'next/server';
import { statsService } from '../../_lib/stats/stats.service';

export async function GET(): Promise<NextResponse> {
	await statsService.savePreciseInstanceStats();

	return new NextResponse();
}
