import type {Static} from '@sinclair/typebox';
import {Type} from '../utils/typebox.js';

export const UrlBlocked = Type.Object(
	{
		statusCode: Type.EnumList([410] as const),
		code: Type.EnumList(['E_URL_BLOCKED'] as const),
		error: Type.EnumList(['Gone'] as const),
		message: Type.String(),
	},
	{
		description: "That URL has been blocked and can't be visited",
	},
);

export type UrlBlocked = Static<typeof UrlBlocked>;
