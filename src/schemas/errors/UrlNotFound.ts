import type {Static} from '@sinclair/typebox';
import {Type} from '../../utils/typebox.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const UrlNotFound = Type.Object(
	{
		statusCode: Type.EnumList([404]),
		code: Type.EnumList(['E_URL_NOT_FOUND']),
		error: Type.EnumList(['Not Found']),
		message: Type.String(),
	},
	{
		$id: 'UrlNotFoundError',
		title: 'UrlNotFoundError',
		description: 'Shortened URL not found in database',
	},
);

export type UrlNotFound = Static<typeof UrlNotFound>;
