import { Controller, Get, Inject, NotFoundException } from '@nestjs/common';
import type { OpenAPIObject } from '@nestjs/swagger';
import { OpenapiService } from './openapi.service';

@Controller('/openapi.json')
export class OpenapiController {
	constructor(@Inject(OpenapiService) private readonly openapiService: OpenapiService) {}

	@Get('/')
	getSpec(): OpenAPIObject {
		const spec = this.openapiService.getSpec();

		if (!spec) {
			throw new NotFoundException('OpenAPI spec not found');
		}

		return spec;
	}
}
