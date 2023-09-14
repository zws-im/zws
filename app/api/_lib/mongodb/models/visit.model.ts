import { schema, types } from 'papr';
import { papr } from '../papr';

const visitSchema = schema({
	timestamp: types.date({ required: true }),
	shortenedUrl: types.objectId({ required: true }),
});

export const VisitModel = papr.model('visits', visitSchema);
