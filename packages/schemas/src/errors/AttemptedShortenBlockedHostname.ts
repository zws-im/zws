import type {Static} from '@sinclair/typebox';
import {Type} from '../utils/typebox.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AttemptedShortenBlockedHostname = Type.Object(
	{
		statusCode: Type.EnumList([422] as const),
		code: Type.EnumList(['E_SHORTEN_BLOCKED_HOSTNAME'] as const),
		error: Type.EnumList(['Unprocessable Entity'] as const),
		message: Type.String(),
	},
	{
		description: 'Shortening that hostname is forbidden',
	},
);

export type AttemptedShortenBlockedHostname = Static<typeof AttemptedShortenBlockedHostname>;
