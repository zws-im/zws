import { multiReplace } from '@jonahsnider/util';
import { z } from 'zod';
import { configService } from '../../config/config.service';
import { Short } from '../interfaces/urls.interface';

export const ShortSchema = z.string().transform((raw) => {
	return multiReplace(raw, configService.shortCharRewrites) as Short;
});
export type ShortSchema = z.infer<typeof ShortSchema>;
