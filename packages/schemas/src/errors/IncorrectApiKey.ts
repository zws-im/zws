import type {Static} from '@sinclair/typebox';
import {Type} from '../utils/typebox.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const IncorrectApiKey = Type.Object(
	{
		statusCode: Type.EnumList([401] as const),
		code: Type.EnumList(['E_INCORRECT_API_KEY'] as const),
		error: Type.EnumList(['Unauthorized'] as const),
		message: Type.String(),
	},
	{
		description: 'The provided API key was incorrect',
	},
);

export type IncorrectApiKey = Static<typeof IncorrectApiKey>;
