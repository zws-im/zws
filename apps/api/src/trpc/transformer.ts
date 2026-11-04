import { uneval } from 'devalue';
import superjson from 'superjson';

export const transformer = {
	input: superjson,
	output: {
		serialize: (object: unknown) => uneval(object),
		// oxlint-disable-next-line no-eval -- This safe as it only runs client-side (so, only using output from our API)
		deserialize: (object: unknown) => eval(`(${String(object)})`),
	},
};
