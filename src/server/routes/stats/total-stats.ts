import {RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import {urls} from '../../../services';

const route: RouteOptions<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, {Reply: {urls: number; visits: number}}> = {
	method: 'GET',
	url: '/stats',
	handler: async (request, reply) => {
		const stats = await urls.totalStats();

		return stats;
	}
};

export default route;
