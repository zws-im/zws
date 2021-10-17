import type {Static} from '@sinclair/typebox';
import {Type} from '../../utils/typebox.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const UniqueShortIdTimeout = Type.Object(
	{
		statusCode: Type.EnumList([503]),
		code: Type.EnumList(['E_UNIQUE_SHORT_ID_TIMEOUT']),
		error: Type.EnumList(['Service Unavailable']),
		message: Type.String(),
	},
	{
		description: "Couldn't generate a unique shortened ID in time",
	},
);

export type UniqueShortIdTimeout = Static<typeof UniqueShortIdTimeout>;
