import {Static, Type} from '@sinclair/typebox';

export const ShortenedUrl = Type.Object(
	{
		short: Type.String({description: 'The short ID.'}),
		url: Type.Optional(Type.String({description: 'The absolute URL for the shortened URL'})),
	},
	{$id: 'ShortenedUrl', title: 'ShortenedUrl', description: 'Shortened URL'},
);

export type ShortenedUrl = Static<typeof ShortenedUrl>;
