import type {Static} from '@sinclair/typebox';
import {Type} from '../../utils/typebox.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ShieldsEndpointResponse = Type.Object(
	{
		schemaVersion: Type.EnumList([1]),
		label: Type.String(),
		message: Type.String(),
		color: Type.String(),
	},
	{
		$id: 'ShieldsEndpointResponse',
		title: 'ShieldsEndpointResponse',
		description: 'Shields endpoint response',
	},
);

export type ShieldsEndpointResponse = Static<typeof ShieldsEndpointResponse>;
