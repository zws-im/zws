import { Controller, Get, Inject, SerializeOptions } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OpenapiTag } from '../openapi/openapi-tag.enum.js';
import { ShieldsResponseSchema } from './dtos/shields-response.dto.js';
import { ShieldsBadgesService } from './shields-badges.service.js';

@Controller('/stats/shields')
@ApiTags(OpenapiTag.Badges)
export class ShieldsBadgesController {
	constructor(@Inject(ShieldsBadgesService) private readonly shieldsBadgesService: ShieldsBadgesService) {}

	@Get('/version')
	@ApiResponse({ standardSchema: ShieldsResponseSchema })
	@SerializeOptions({ schema: ShieldsResponseSchema })
	getVersionBadge(): ShieldsResponseSchema {
		return this.shieldsBadgesService.getVersionBadge();
	}

	@Get('/urls')
	@ApiResponse({ standardSchema: ShieldsResponseSchema })
	@SerializeOptions({ schema: ShieldsResponseSchema })
	getUrlsBadge(): Promise<ShieldsResponseSchema> {
		return this.shieldsBadgesService.getUrlStatsBadge();
	}

	@Get('/visits')
	@ApiResponse({ standardSchema: ShieldsResponseSchema })
	@SerializeOptions({ schema: ShieldsResponseSchema })
	getVisitsBadge(): Promise<ShieldsResponseSchema> {
		return this.shieldsBadgesService.getVisitsStatsBadge();
	}
}
