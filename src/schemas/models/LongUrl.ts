import {Static, Type} from '@sinclair/typebox';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const LongUrl = Type.Object(
	{
		url: Type.String({maxLength: 500, format: 'uri', examples: ['https://jonahsnider.com']}),
	},
	{$id: 'LongUrl', title: 'LongUrl', description: 'A long URL'},
);

export type LongUrl = Static<typeof LongUrl>;
