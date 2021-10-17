import type {Static} from '@sinclair/typebox';
import {Type} from '../../utils/typebox.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const MissingApiKey = Type.Object(
	{
		statusCode: Type.EnumList([401]),
		code: Type.EnumList(['E_MISSING_API_KEY']),
		error: Type.EnumList(['Unauthorized']),
		message: Type.String(),
	},
	{
		description: 'You must provide an API key to access this route',
	},
);

export type MissingApiKey = Static<typeof MissingApiKey>;
