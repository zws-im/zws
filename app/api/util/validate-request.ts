import { NextRequest, NextResponse } from 'next/server';
import { Schema, z } from 'zod';
import { ExceptionSchema } from '../dtos/exception.dto';
import { InvalidPathParamException } from '../exceptions/invalid-path-param.exception';
import { InvalidQueryParamsException } from '../exceptions/invalid-query-param.exception';

export function validateQuery<T extends Schema>(
	request: NextRequest,
	schema: T,
): NextResponse<ExceptionSchema> | z.infer<T> {
	const query = Object.fromEntries(request.nextUrl.searchParams.entries());

	const result = schema.safeParse(query);

	if (result.success) {
		return result.data;
	}

	return new InvalidPathParamException(result.error).toResponse();
}

export function validateParams<T extends Schema>(
	context: { params: Record<string, string> },
	schema: T,
): NextResponse<ExceptionSchema> | z.infer<T> {
	const result = schema.safeParse(context.params);

	if (result.success) {
		return result.data;
	}

	return new InvalidQueryParamsException(result.error).toResponse();
}

export async function validateBody<T extends Schema>(
	request: NextRequest,
	schema: T,
): Promise<NextResponse<ExceptionSchema> | z.infer<T>> {
	const body = await request.json();

	const result = schema.safeParse(body);

	if (result.success) {
		return result.data;
	}

	return new InvalidQueryParamsException(result.error).toResponse();
}
