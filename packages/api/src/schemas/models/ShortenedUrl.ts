import type {Static} from '@sinclair/typebox';
import {Type} from '../../utils/typebox.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ShortenedUrl = Type.Object(
	{
		short: Type.String({description: 'The short ID.'}),
		url: Type.Optional(Type.String({description: 'The absolute URL for the shortened URL'})),
	},
	{$id: 'ShortenedUrl', title: 'ShortenedUrl', description: 'Shortened URL'},
);

export type ShortenedUrl = Static<typeof ShortenedUrl>;
