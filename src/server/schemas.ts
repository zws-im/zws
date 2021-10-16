import type {FastifyInstance} from 'fastify';

import * as Schemas from '../schemas';

// Manually doing this is required to avoid the compiler giving up and making these values any
const routes = [Object.values(Schemas.Errors), Object.values(Schemas.Inputs), Object.values(Schemas.Models)].flat().filter(schema => Boolean(schema.$id));

export default function addSchemas(fastify: FastifyInstance): void {
	for (const schema of routes) {
		fastify.addSchema(schema);
	}
}
