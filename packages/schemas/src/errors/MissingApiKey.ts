import type {Static} from '@sinclair/typebox';
import {Type} from '../utils/typebox.js';

export const MissingApiKey = Type.Object(
	{
		statusCode: Type.EnumList([401] as const),
		code: Type.EnumList(['E_MISSING_API_KEY'] as const),
		error: Type.EnumList(['Unauthorized'] as const),
		message: Type.String(),
	},
	{
		description: 'You must provide an API key to access this route',
	},
);

export type MissingApiKey = Static<typeof MissingApiKey>;
