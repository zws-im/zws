import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AppConfig} from './app.config';

@Module({
	imports: [ConfigModule],
	providers: [AppConfig],
	exports: [AppConfig],
})
export class AppConfigModule {}
