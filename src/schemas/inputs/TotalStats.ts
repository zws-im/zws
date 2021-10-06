import {Static, Type} from '@sinclair/typebox';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Formatting = Type.Object({
	format: Type.Boolean({default: false}),
});

export type Formatting = Static<typeof Formatting>;
