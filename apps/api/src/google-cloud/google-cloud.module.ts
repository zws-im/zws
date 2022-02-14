import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AppConfigModule} from '../app-config/app-config.module';
import {GoogleCloudConfig} from './google-cloud.config';
import {GoogleCloudService} from './google-cloud.service';

@Module({
	imports: [AppConfigModule, ConfigModule],
	providers: [GoogleCloudService.profilerProvider, GoogleCloudService, GoogleCloudConfig],
})
export class GoogleCloudModule {}
