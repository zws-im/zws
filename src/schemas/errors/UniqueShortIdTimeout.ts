import {Static, Type} from '@sinclair/typebox';

export const UniqueShortIdTimeout = Type.Object(
	{
		statusCode: Type.Literal(503),
		code: Type.Literal('E_UNIQUE_SHORT_ID_TIMEOUT'),
		error: Type.Literal('Service Unavailable'),
		message: Type.String(),
	},
	{
		description: "Couldn't generate a unique shortened ID in time",
	},
);

export type UniqueShortIdTimeout = Static<typeof UniqueShortIdTimeout>;
