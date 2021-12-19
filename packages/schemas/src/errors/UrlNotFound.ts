import type {Static} from '@sinclair/typebox';
import {Type} from '../utils/typebox.js';

export const UrlNotFound = Type.Object(
	{
		statusCode: Type.EnumList([404] as const),
		code: Type.EnumList(['E_URL_NOT_FOUND'] as const),
		error: Type.EnumList(['Not Found'] as const),
		message: Type.String(),
	},
	{
		$id: 'UrlNotFoundError',
		title: 'UrlNotFoundError',
		description: 'Shortened URL not found in database',
	},
);

export type UrlNotFound = Static<typeof UrlNotFound>;
