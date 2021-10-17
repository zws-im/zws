import type {Static} from '@sinclair/typebox';
import {Type} from '../../utils/typebox.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const UrlBlocked = Type.Object(
	{
		statusCode: Type.EnumList([410]),
		code: Type.EnumList(['E_URL_BLOCKED']),
		error: Type.EnumList(['Gone']),
		message: Type.String(),
	},
	{
		description: "That URL has been blocked and can't be visited",
	},
);

export type UrlBlocked = Static<typeof UrlBlocked>;
