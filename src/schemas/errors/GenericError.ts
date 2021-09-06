import {Static, Type} from '@sinclair/typebox';

export const GenericError = Type.Object(
	{
		statusCode: Type.Integer({minimum: 400, maximum: 599, examples: [500]}),
		code: Type.Optional(Type.String()),
		error: Type.String({examples: ['Internal Server Error']}),
		message: Type.String(),
	},
	{
		$id: 'Error',
		title: 'Error',
		description: 'Generic error response',
	},
);

export type GenericError = Static<typeof GenericError>;
