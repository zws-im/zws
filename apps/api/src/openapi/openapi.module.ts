import {Module} from '@nestjs/common';
import {AppConfigModule} from '../app-config/app-config.module';
import {OpenApiService} from './openapi.service';

@Module({
	imports: [AppConfigModule],
	providers: [OpenApiService],
})
export class OpenApiModule {}
