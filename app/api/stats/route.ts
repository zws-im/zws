import { NextResponse } from 'next/server';
import { Stats } from './interfaces/stats.interface';
import { statsService } from './stats.service';

export async function GET(): Promise<NextResponse<Stats>> {
	const stats = await statsService.getInstanceStats();

	return NextResponse.json(stats);
}
