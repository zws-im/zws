import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OpenapiTag } from '../openapi/openapi-tag.enum';

@Controller('health')
@ApiTags(OpenapiTag.Health)
export class HealthController {
	@Get('/')
	getHealth(): { status: 'ok' } {
		return { status: 'ok' };
	}
}
