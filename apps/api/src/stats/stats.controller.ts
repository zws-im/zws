import {Controller} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';

@ApiTags('stats')
@Controller('stats')
export class StatsController {}
