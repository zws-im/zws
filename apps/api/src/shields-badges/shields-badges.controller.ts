import {Controller, Get} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import type {ShieldsResponseDto} from './dto/shields-response.dto';
import {ShieldsBadgesService} from './shields-badges.service';

@Controller('stats/shields')
@ApiTags('shields')
export class ShieldsBadgesController {
	constructor(private readonly service: ShieldsBadgesService) {}

	@Get('urls')
	@ApiOperation({
		operationId: 'shields-urls',
		summary: 'Shields endpoint for URLs',
		description: 'Shields endpoint badge response for total number of URLs shortened.',
	})
	async urlStatsBadge(): Promise<ShieldsResponseDto> {
		return this.service.urlStatsBadge();
	}

	@Get('visits')
	@ApiOperation({
		operationId: 'shields-visits',
		summary: 'Shields endpoint for visits',
		description: 'Shields endpoint badge response for total number of shortened URLs visited.',
	})
	async visitsStatsBadge(): Promise<ShieldsResponseDto> {
		return this.service.visitsStatsBadge();
	}

	@Get('version')
	@ApiOperation({
		operationId: 'shields-version',
		summary: 'Shields endpoint for version',
		description: 'Shields endpoint badge response for instance version.',
	})
	async versionBadge(): Promise<ShieldsResponseDto> {
		return this.service.versionBadge();
	}
}
