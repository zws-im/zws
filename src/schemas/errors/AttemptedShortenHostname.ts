import type {Static} from '@sinclair/typebox';
import {Type} from '../../utils/typebox.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AttemptedShortenHostname = Type.Object(
	{
		statusCode: Type.EnumList([422] as const),
		code: Type.EnumList(['E_SHORTEN_HOSTNAME'] as const),
		error: Type.EnumList(['Unprocessable Entity'] as const),
		message: Type.String(),
	},
	{
		description: 'Shortening a URL with the same hostname as the server is disallowed',
	},
);

export type AttemptedShortenHostname = Static<typeof AttemptedShortenHostname>;
