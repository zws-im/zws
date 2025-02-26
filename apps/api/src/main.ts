import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

const app = await NestFactory.create(AppModule, {
	abortOnError: process.env['NODE_ENV'] !== 'development',
	cors: true,
});


const configService = app.get(ConfigService);

await app.listen(configService.port);
