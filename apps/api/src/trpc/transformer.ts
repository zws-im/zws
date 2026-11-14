import { parse, stringify } from 'devalue';
import superjson from 'superjson';

export const transformer = {
	input: superjson,
	output: {
		serialize: (object: unknown) => stringify(object),
		deserialize: (object: unknown) => parse(String(object)),
	},
};
