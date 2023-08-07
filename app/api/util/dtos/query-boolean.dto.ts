import yn from 'yn';
import { z } from 'zod';

export const QueryBooleanSchema = z
	.string()
	.transform((raw) => yn(raw));
export type QueryBooleanSchema = z.infer<typeof QueryBooleanSchema>;
