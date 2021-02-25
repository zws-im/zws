import {FastifyInstance} from 'fastify';
import AttemptedShortenHostnameError from '../schemas/models/AttemptedShortenHostnameError.json';
import ErrorModel from '../schemas/models/Error.json';
import IncorrectApiKeyError from '../schemas/models/IncorrectApiKeyError.json';
import MissingApiKeyError from '../schemas/models/MissingApiKeyError.json';
import Short from '../schemas/models/Short.json';
import Stats from '../schemas/models/Stats.json';
import TotalStatsOptions from '../schemas/parameters/TotalStatsOptions.json';
import UniqueShortIdTimeoutError from '../schemas/models/UniqueShortIdTimeoutError.json';
import Url from '../schemas/models/Url.json';
import UrlNotFoundError from '../schemas/models/UrlNotFoundError.json';
import UrlStats from '../schemas/models/UrlStats.json';
import VisitOptions from '../schemas/parameters/VisitOptions.json';
import ApiKeyError from '../schemas/responses/ApiKeyError.json';
import ShieldsEndpointResponse from '../schemas/responses/ShieldsEndpointResponse.json';

export default function addSchemas(fastify: FastifyInstance): void {
	fastify.addSchema(AttemptedShortenHostnameError);
	fastify.addSchema(ErrorModel);
	fastify.addSchema(IncorrectApiKeyError);
	fastify.addSchema(MissingApiKeyError);
	fastify.addSchema(Short);
	fastify.addSchema(Stats);
	fastify.addSchema(TotalStatsOptions);
	fastify.addSchema(UniqueShortIdTimeoutError);
	fastify.addSchema(Url);
	fastify.addSchema(VisitOptions);
	fastify.addSchema(ApiKeyError);
	fastify.addSchema(UrlNotFoundError);
	fastify.addSchema(UrlStats);
	fastify.addSchema(ShieldsEndpointResponse);
}
