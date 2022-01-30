import {Module} from '@nestjs/common';
import {AppConfigService} from '../app.config';
import {Logger} from './logger.service';
import {NestLogger} from './nest-logger.service';

@Module({
	providers: [Logger, NestLogger, AppConfigService],
	exports: [Logger, NestLogger],
})
export class LoggerModule {}
