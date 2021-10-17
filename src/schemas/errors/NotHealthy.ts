import type {Static} from '@sinclair/typebox';
import {Type} from '../../utils/typebox.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const NotHealthy = Type.Object(
	{
		statusCode: Type.EnumList([500]),
		code: Type.EnumList(['E_NOT_HEALTHY']),
		error: Type.EnumList(['Internal Server Error']),
		message: Type.String(),
	},
	{
		description: 'The server is not healthy',
	},
);

export type NotHealthy = Static<typeof NotHealthy>;
