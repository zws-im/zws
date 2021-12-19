import type {Static} from '@sinclair/typebox';
import {Type} from '../utils/typebox.js';

export const Formatting = Type.Object({
	format: Type.Boolean({default: false}),
});

export type Formatting = Static<typeof Formatting>;
