import {Static, Type} from '@sinclair/typebox';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const UrlBlocked = Type.Object(
	{
		statusCode: Type.Literal(410),
		code: Type.Literal('E_URL_BLOCKED'),
		error: Type.Literal('Gone'),
		message: Type.String(),
	},
	{
		description: "That URL has been blocked and can't be visited",
	},
);

export type UrlBlocked = Static<typeof UrlBlocked>;
