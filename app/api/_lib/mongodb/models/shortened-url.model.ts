import { schema, types } from 'papr';
import { papr } from '../papr';

const shortenedUrlSchema = schema({
	shortBase64: types.string({ required: true }),
	url: types.string({ required: true }),
	blocked: types.boolean({ required: true }),
	createdAt: types.date({ required: true }),
});

export const ShortenedUrlModel = papr.model('shortenedUrls', shortenedUrlSchema);
