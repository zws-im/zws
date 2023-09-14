import { ObjectId } from 'mongodb';

export type ShortenedUrl = {
	_id: ObjectId;
	shortBase64: string;
	url: string;
	blocked: boolean;
	createdAt: Date;
};
