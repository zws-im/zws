import {Static, Type} from '@sinclair/typebox';
import {Merge} from 'type-fest';

export const UrlStats = Type.Object(
	{
		url: Type.String(),
		visits: Type.Array(Type.Integer({format: 'date'})),
	},
	{
		$id: 'UrlStats',
		title: 'UrlStats',
		description: 'Usage statistics for a shortened URL',
	},
);

export type UrlStats = Merge<Static<typeof UrlStats>, {visits: Date[]}>;
