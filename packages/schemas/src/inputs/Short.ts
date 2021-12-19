import type {Static} from '@sinclair/typebox';
import {Type} from '../utils/typebox.js';

export const Short = Type.Object(
	{
		short: Type.String({description: 'The short ID.'}),
	},
	{$id: 'Short', title: 'Short', description: 'Shortened URL ID'},
);

export type Short = Static<typeof Short>;
