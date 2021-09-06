import {Static, Type} from '@sinclair/typebox';

export const Short = Type.Object(
	{
		short: Type.String({description: 'The short ID.'}),
	},
	{$id: 'Short', title: 'Short', description: 'Shortened URL ID'},
);

export type Short = Static<typeof Short>;
