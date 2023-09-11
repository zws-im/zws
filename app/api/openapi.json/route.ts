import { NextResponse } from 'next/server';
import { oas31 } from 'openapi3-ts';
import { exceptionRouteWrapper } from '../_lib/exception-route-wrapper';
import { openapiService } from '../_lib/openapi/openapi.service';

export const GET = exceptionRouteWrapper.wrapRoute<oas31.OpenAPIObject>(() => {
	return NextResponse.json(openapiService.getOpenapi());
});
