import {RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import S from 'fluent-json-schema';
import {urls} from '../../../services';

const route: RouteOptions<
	RawServerDefault,
	RawRequestDefaultExpression,
	RawReplyDefaultExpression,
	{Params: {short: string}; Querystring: {visit: boolean}; Reply: '' | {url: string}}
> = {
	method: 'GET',
	url: '/:short',
	schema: {
		params: S.object().prop('short', S.string()),
		querystring: S.object().prop('visit', S.boolean().default(true))
	},
	handler: async (request, reply) => {
		const {
			query: {visit},
			params: {short}
		} = request;

		const url = await urls.visit(urls.normalizeShortId(short), visit);

		if (url === null) {
			void reply.status(404);
			return '';
		}

		if (visit) {
			void reply.redirect(url);
		} else {
			return {url};
		}
	}
};

export default route;
