import { Module } from '@nestjs/common';
import { OpenapiController } from './openapi.controller';
import { OpenapiService } from './openapi.service';

@Module({
	providers: [OpenapiService],
	controllers: [OpenapiController],
})
export class OpenapiModule {}
