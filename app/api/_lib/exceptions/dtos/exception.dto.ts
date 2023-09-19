import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { ValidationExceptionSchema } from 'next-api-utils/client';
import { z } from 'zod';
import { ExceptionCode } from '../enums/exceptions.enum';

extendZodWithOpenApi(z);

export const ExceptionSchema = z
	.object({
		message: z.string(),
		code: z.nativeEnum(ExceptionCode).optional(),
		statusCode: z.number(),
		error: z.string(),
	})
	.or(ValidationExceptionSchema)
	.openapi('Exception');
export type ExceptionSchema = z.infer<typeof ExceptionSchema>;
