import {Static, Type} from '@sinclair/typebox';

export const ShieldsEndpointResponse = Type.Object(
	{
		schemaVersion: Type.Literal(1),
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
