import {Static, Type} from '@sinclair/typebox';

export const LongUrl = Type.Object(
	{
		url: Type.String({maxLength: 500, format: 'uri', examples: ['https://jonahsnider.com']}),
	},
	{$id: 'LongUrl', title: 'LongUrl', description: 'A long URL'},
);

export type LongUrl = Static<typeof LongUrl>;
