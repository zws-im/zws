import { ObjectId } from 'mongodb';

export type Visit = {
	_id: ObjectId;
	shortenedUrlBase64: string;
	timestamp: Date;
	id: number;
};
