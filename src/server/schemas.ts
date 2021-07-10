import {FastifyInstance} from 'fastify';
import AttemptedShortenBlockedHostnameError from '../schemas/models/AttemptedShortenBlockedHostnameError.json';
import AttemptedShortenHostnameError from '../schemas/models/AttemptedShortenHostnameError.json';
import ErrorModel from '../schemas/models/Error.json';
import IncorrectApiKeyError from '../schemas/models/IncorrectApiKeyError.json';
import MissingApiKeyError from '../schemas/models/MissingApiKeyError.json';
import NotHealthyError from '../schemas/models/NotHealthyError.json';
import Short from '../schemas/models/Short.json';
import Stats from '../schemas/models/Stats.json';
import UniqueShortIdTimeoutError from '../schemas/models/UniqueShortIdTimeoutError.json';
import Url from '../schemas/models/Url.json';
import UrlBlockedError from '../schemas/models/UrlBlockedError.json';
import UrlNotFoundError from '../schemas/models/UrlNotFoundError.json';
import UrlStats from '../schemas/models/UrlStats.json';
import TotalStatsOptions from '../schemas/parameters/TotalStatsOptions.json';
import VisitOptions from '../schemas/parameters/VisitOptions.json';
import ApiKeyError from '../schemas/responses/ApiKeyError.json';
import ShieldsEndpointResponse from '../schemas/responses/ShieldsEndpointResponse.json';
import ShortenHostnameError from '../schemas/responses/ShortenHostnameError.json';

const schemas = [
	AttemptedShortenBlockedHostnameError,
	AttemptedShortenHostnameError,
	ErrorModel,
	IncorrectApiKeyError,
	MissingApiKeyError,
	NotHealthyError,
	Short,
	Stats,
	UniqueShortIdTimeoutError,
	Url,
	UrlBlockedError,
	UrlNotFoundError,
	UrlStats,
	TotalStatsOptions,
	VisitOptions,
	ApiKeyError,
	ShieldsEndpointResponse,
	ShortenHostnameError,
];

export default function addSchemas(fastify: FastifyInstance): void {
	for (const schema of schemas) {
		fastify.addSchema(schema);
	}
}
