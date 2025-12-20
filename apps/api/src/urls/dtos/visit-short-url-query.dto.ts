import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const VisitShortUrlQuery = z.object({
	visit: z.stringbool().optional().default(true),
});
export type VisitShortUrlQuery = z.infer<typeof VisitShortUrlQuery>;

export class VisitShortUrlQueryDto extends createZodDto(VisitShortUrlQuery) {}
