import type { Short } from '../dtos/short.dto.js';

export type ShortenedUrlData = {
	short: Short;
	url: URL;
};
