import { z } from 'zod';

export const ShieldsResponseSchema = z.object({
	schemaVersion: z.literal(1),

	cacheSeconds: z.number().min(300).optional(),

	/**
	 * @example 'urls'
	 */
	label: z.string(),

	/**
	 * @example '3.4M'
	 */
	message: z.string(),

	color: z.string().optional(),
	labelColor: z.string().optional(),
	isError: z.string().optional(),
	namedLogo: z.string().optional(),
	logoSvg: z.string().optional(),
	logoColor: z.string().optional(),
	logoWidth: z.string().optional(),
	logoPosition: z.string().optional(),
	style: z.string().optional(),
});
export type ShieldsResponseSchema = z.infer<typeof ShieldsResponseSchema>;
