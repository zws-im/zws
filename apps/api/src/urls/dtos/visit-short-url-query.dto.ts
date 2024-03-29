import { z } from 'zod';

import { createZodDto } from '@anatine/zod-nestjs';
import { QueryBooleanSchema } from 'next-api-utils';

export const VisitShortUrlQuery = z.object({
	visit: QueryBooleanSchema.optional().default(true),
});
export type VisitShortUrlQuery = z.infer<typeof VisitShortUrlQuery>;

export class VisitShortUrlQueryDto extends createZodDto(VisitShortUrlQuery) {}
