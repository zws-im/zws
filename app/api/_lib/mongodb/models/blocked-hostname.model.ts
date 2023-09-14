import { schema, types } from 'papr';
import { papr } from '../papr';

const blockedHostnameSchema = schema({
	hostname: types.string({ required: true }),
	createdAt: types.date({ required: true }),
});

export const BlockedHostnameModel = papr.model('blockedHostnames', blockedHostnameSchema);
