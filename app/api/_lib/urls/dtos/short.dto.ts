import { z } from 'zod';
import { multiReplace } from '@jonahsnider/util';
import { Short } from '../interfaces/urls.interface';
import { configService } from '../../config/config.service';

export const ShortSchema = z.string().transform((raw) => {
	return multiReplace(raw, configService.shortCharRewrites) as Short;
});
export type ShortSchema = z.infer<typeof ShortSchema>;
