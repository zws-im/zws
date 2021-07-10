import {FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteOptions} from 'fastify';
import {Http} from '@jonahsnider/util';
import Short from '../../../../../types/schemas/models/Short';
import UrlStats from '../../../../../types/schemas/models/UrlStats';
import {server} from '../../../../config';
import {urls} from '../../services';
import {UrlNotFound} from '../../../errors';

export default function getRoute(fastify: FastifyInstance) {
	const route: RouteOptions<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, {Params: Short; Reply: UrlStats}> = {
		method: 'GET',
		url: '/:short/stats',
		schema: {
			operationId: 'urls-stats',
			summary: 'URL stats',
			description: 'Retrieve usage statistics for a shortened URL',
			tags: [server.Tags.Urls, server.Tags.Stats],
			params: fastify.getSchema('https://zws.im/schemas/Short.json'),
			response: {
				[Http.Status.Ok]: fastify.getSchema('https://zws.im/schemas/UrlStats.json'),
				[Http.Status.NotFound]: fastify.getSchema('https://zws.im/schemas/UrlNotFoundError.json'),
				[Http.Status.InternalServerError]: fastify.getSchema('https://zws.im/schemas/Error.json'),
			},
		},
		handler: async request => {
			const {
				params: {short},
			} = request;

			const stats = await urls.stats(urls.normalizeShortId(short as urls.Short));

			if (stats === null) {
				throw new UrlNotFound();
			}

			return stats;
		},
	};

	return route;
}
