import type {Static} from '@sinclair/typebox';
import {Type} from '../utils/typebox.js';

export const ShieldsEndpointResponse = Type.Object(
	{
		// Seems to be a fast-json-stringify bug https://github.com/fastify/fastify/issues/2818
		schemaVersion: {...Type.EnumList([1] as const), type: 'number'},
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
