import { Controller, Get, Inject } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OpenapiTag } from '../openapi/openapi-tag.enum';
import { ShieldsResponseDto } from './dtos/shields-response.dto';
import { ShieldsBadgesService } from './shields-badges.service';

@Controller('/stats/shields')
@ApiTags(OpenapiTag.Badges)
export class ShieldsBadgesController {
	constructor(@Inject(ShieldsBadgesService) private readonly shieldsBadgesService: ShieldsBadgesService) {}

	@Get('/version')
	@ApiResponse({ type: ShieldsResponseDto })
	getVersionBadge(): ShieldsResponseDto {
		return this.shieldsBadgesService.getVersionBadge();
	}

	@Get('/urls')
	@ApiResponse({ type: ShieldsResponseDto })
	getUrlsBadge(): Promise<ShieldsResponseDto> {
		return this.shieldsBadgesService.getUrlStatsBadge();
	}

	@Get('/visits')
	@ApiResponse({ type: ShieldsResponseDto })
	getVisitsBadge(): Promise<ShieldsResponseDto> {
		return this.shieldsBadgesService.getVisitsStatsBadge();
	}
}
