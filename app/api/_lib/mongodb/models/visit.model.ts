import { schema, types } from 'papr';
import { papr } from '../papr';

const visitSchema = schema({
	shortenedUrlBase64: types.string({ required: true }),
	timestamp: types.date({ required: true }),
	id: types.number({ required: true }),
});

export type VisitDocument = typeof visitSchema[0];
export const VisitModel = papr.model('visits', visitSchema);
