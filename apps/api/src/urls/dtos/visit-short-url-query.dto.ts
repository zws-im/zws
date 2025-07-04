import { createZodDto } from '@anatine/zod-nestjs';
import { QueryBooleanSchema } from 'next-api-utils';
import { z } from 'zod';

export const VisitShortUrlQuery = z.object({
	visit: QueryBooleanSchema.optional().default(true),
});
export type VisitShortUrlQuery = z.infer<typeof VisitShortUrlQuery>;

export class VisitShortUrlQueryDto extends createZodDto(VisitShortUrlQuery) {}
