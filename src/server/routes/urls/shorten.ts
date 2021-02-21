import {RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import S from 'fluent-json-schema';
// eslint-disable-next-line node/prefer-global/url
import {URL} from 'url';
import {server} from '../../../config';
import {urls} from '../../../services';
import {AttemptedShortenHostname} from '../../errors';

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

		if (new URL(url).hostname === server.hostname) {
			throw new AttemptedShortenHostname();
		}

		const id = await urls.shorten(url);

		void reply.code(201);

		return {short: id};
	}
};

export default route;
