import {Static, Type} from '@sinclair/typebox';

export const Formatting = Type.Object({
	format: Type.Boolean({default: false}),
});

export type Formatting = Static<typeof Formatting>;
