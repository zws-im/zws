import { StatsSchema } from '@/app/api/_lib/stats/dtos/stats.dto';
import { statsService } from '@/app/api/_lib/stats/stats.service';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<StatsSchema>> {
	const stats = await statsService.getInstanceStats();

	return NextResponse.json(stats);
}
