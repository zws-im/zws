import { ShieldsResponseSchema } from '@/app/api/_lib/shields-badges/dtos/shields-response.dto';
import { shieldsBadgesService } from '@/app/api/_lib/shields-badges/shields-badges.service';
import { NextResponse } from 'next/server';

// rome-ignore lint/nursery/useNamingConvention: Function name is required for Next.js
export function GET(): NextResponse<ShieldsResponseSchema> {
	return NextResponse.json(shieldsBadgesService.getVersionBadge());
}
