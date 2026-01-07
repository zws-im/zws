import { multiReplace } from '@jonahsnider/util';
import { z } from 'zod';

import { env } from '../../config/config.service.js';

export const Short = z.string().transform((raw) => {
	return multiReplace(raw, env.SHORT_REWRITES);
});
export type Short = z.infer<typeof Short>;
