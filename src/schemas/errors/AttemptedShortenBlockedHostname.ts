import {Static, Type} from '@sinclair/typebox';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AttemptedShortenBlockedHostname = Type.Object(
	{
		statusCode: Type.Literal(422),
		code: Type.Literal('E_SHORTEN_BLOCKED_HOSTNAME'),
		error: Type.Literal('Unprocessable Entity'),
		message: Type.String(),
	},
	{
		description: 'Shortening that hostname is forbidden',
	},
);

export type AttemptedShortenBlockedHostname = Static<typeof AttemptedShortenBlockedHostname>;
