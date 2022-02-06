import {Module} from '@nestjs/common';
import {AppConfigModule} from '../app-config/app-config.module';
import {Logger} from './logger.service';
import {NestLogger} from './nest-logger.service';

@Module({
	imports: [AppConfigModule],
	providers: [Logger, NestLogger],
	exports: [Logger],
})
export class LoggerModule {}
