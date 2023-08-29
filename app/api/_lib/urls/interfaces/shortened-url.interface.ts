import { Short } from './urls.interface';

export type ShortenedUrlData = {
	short: Short;
	url: URL | undefined;
};
