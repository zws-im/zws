import { ValidationExceptionSchema } from '@jonahsnider/nextjs-api-utils/client';
import { z } from 'zod';
import { ExceptionCode } from '../enums/exceptions.enum';

export const ExceptionSchema = z
	.object({
		message: z.string(),
		code: z.nativeEnum(ExceptionCode).optional(),
		statusCode: z.number(),
		error: z.string(),
	})
	.or(ValidationExceptionSchema);
export type ExceptionSchema = z.infer<typeof ExceptionSchema>;
