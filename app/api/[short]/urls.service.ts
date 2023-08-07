import { Base64 } from './interfaces/urls.interface';

export class UrlsService {
	static encode(value: string): Base64 {
		return Buffer.from(value).toString('base64') as Base64;
	}
}

export const urlsService = new UrlsService();
