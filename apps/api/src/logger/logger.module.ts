import {Module} from '@nestjs/common';
import {AppConfigModule} from '../app-config/app-config.module';
import {LoggerService} from './logger.service';
import {NestLogger} from './nest-logger.service';

@Module({
	imports: [AppConfigModule],
	providers: [LoggerService, NestLogger],
	exports: [LoggerService],
})
export class LoggerModule {}
