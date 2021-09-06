import {Static, Type} from '@sinclair/typebox';

export const AttemptedShortenHostname = Type.Object(
	{
		statusCode: Type.Literal(422),
		code: Type.Literal('E_SHORTEN_HOSTNAME'),
		error: Type.Literal('Unprocessable Entity'),
		message: Type.String(),
	},
	{
		description: 'Shortening a URL with the same hostname as the server is disallowed',
	},
);

export type AttemptedShortenHostname = Static<typeof AttemptedShortenHostname>;
