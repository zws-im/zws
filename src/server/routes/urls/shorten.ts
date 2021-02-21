import {RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import S from 'fluent-json-schema';
import {urls} from '../../../services';

const route: RouteOptions<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, {Body: {url: string}; Reply: {short: string}}> = {
	method: 'POST',
	url: '/',
	schema: {
		body: S.object().prop('url', S.string().format(S.FORMATS.URL).maxLength(500))
	},
	handler: async (request, reply) => {
		const {
			body: {url}
		} = request;

		const id = await urls.shorten(url);

		void reply.code(201);

		return {short: id};
	}
};

export default route;
