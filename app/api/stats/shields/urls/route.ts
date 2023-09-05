import { exceptionRouteWrapper } from '@/app/api/_lib/exception-route-wrapper';
import { ShieldsResponseSchema } from '@/app/api/_lib/shields-badges/dtos/shields-response.dto';
import { shieldsBadgesService } from '@/app/api/_lib/shields-badges/shields-badges.service';
import { NextResponse } from 'next/server';

export const GET = exceptionRouteWrapper.wrapRoute<ShieldsResponseSchema>(async () => {
	return NextResponse.json(await shieldsBadgesService.getUrlStatsBadge());
});
