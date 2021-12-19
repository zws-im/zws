import type {Static} from '@sinclair/typebox';
import {Type} from '../utils/typebox.js';

export const Visit = Type.Object({
	visit: Type.Optional(Type.Boolean({default: true, description: 'Whether to redirect to the URL or return the long URL'})),
});

export type Visit = Static<typeof Visit>;
