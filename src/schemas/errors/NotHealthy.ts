import {Static, Type} from '@sinclair/typebox';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const NotHealthy = Type.Object(
	{
		statusCode: Type.Literal(500),
		code: Type.Literal('E_NOT_HEALTHY'),
		error: Type.Literal('Internal Server Error'),
		message: Type.String(),
	},
	{
		description: 'The server is not healthy',
	},
);

export type NotHealthy = Static<typeof NotHealthy>;
