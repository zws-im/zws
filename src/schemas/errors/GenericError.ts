import type {Static} from '@sinclair/typebox';
import {Type} from '@sinclair/typebox';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const GenericError = Type.Object(
	{
		statusCode: Type.Integer({minimum: 400, maximum: 599, example: 500}),
		code: Type.Optional(Type.String()),
		error: Type.String({example: 'Internal Server Error'}),
		message: Type.String(),
	},
	{
		$id: 'Error',
		title: 'Error',
		description: 'Generic error response',
	},
);

export type GenericError = Static<typeof GenericError>;
