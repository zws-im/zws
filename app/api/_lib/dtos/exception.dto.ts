import { z } from 'zod';
import { ExceptionCode } from '../exceptions/enums/exceptions.enum';

export const ExceptionSchema = z.object({
	message: z.string(),
	code: z.nativeEnum(ExceptionCode).optional(),
	statusCode: z.number(),
	error: z.string(),
});
export type ExceptionSchema = z.infer<typeof ExceptionSchema>;
