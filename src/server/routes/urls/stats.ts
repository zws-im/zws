import {RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import S from 'fluent-json-schema';
import {urls} from '../../../services';
import {UrlNotFound} from '../../errors';

const route: RouteOptions<
	RawServerDefault,
	RawRequestDefaultExpression,
	RawReplyDefaultExpression,
	{Params: {short: string}; Reply: {url: string; visits: Date[]}}
> = {
	method: 'GET',
	url: '/:short/stats',
	schema: {
		params: S.object().prop('short', S.string())
	},
	handler: async (request, reply) => {
		const {
			params: {short}
		} = request;

		const stats = await urls.stats(urls.normalizeShortId(short));

		if (stats === null) {
			throw new UrlNotFound();
		}

		return stats;
	}
};

export default route;
