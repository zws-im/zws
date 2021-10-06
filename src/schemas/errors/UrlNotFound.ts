import {Static, Type} from '@sinclair/typebox';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const UrlNotFound = Type.Object(
	{
		statusCode: Type.Literal(404),
		code: Type.Literal('E_URL_NOT_FOUND'),
		error: Type.Literal('Not Found'),
		message: Type.String(),
	},
	{
		$id: 'UrlNotFoundError',
		title: 'UrlNotFoundError',
		description: 'Shortened URL not found in database',
	},
);

export type UrlNotFound = Static<typeof UrlNotFound>;
