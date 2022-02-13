import {Injectable} from '@nestjs/common';
import {DocumentBuilder} from '@nestjs/swagger';
import {paramCase} from 'change-case';
import {AppConfig} from '../app-config/app.config';
import pkg from '../../package.json';

@Injectable()
export class OpenApiService {
	static operationIdFactory(controllerKey: string, methodKey: string) {
		return `${paramCase(controllerKey.replace(/Controller$/, ''))}-${paramCase(methodKey)}`;
	}

	private readonly hostname: string | undefined;
	private readonly port: number;

	constructor(appConfig: AppConfig) {
		this.hostname = appConfig.hostname;
		this.port = appConfig.port;
	}

	getConfig() {
		return new DocumentBuilder()
			.setTitle('Zero Width Shortener')
			.setVersion(pkg.version)
			.setDescription('Shorten URLs with invisible spaces.')
			.setContact(pkg.author.name, pkg.author.url, pkg.author.email)
			.setLicense('Apache 2.0', 'https://www.apache.org/licenses/LICENSE-2.0.html')

			.addBearerAuth({type: 'http'})

			.addServer('http://{host}/{basePath}', 'Custom server (HTTP)', {
				host: {default: this.hostname === undefined ? `localhost:${this.port}` : this.hostname},
				basePath: {default: ''},
			})
			.addServer('https://{host}/{basePath}', 'Custom server (HTTPS)', {
				host: {default: this.hostname === undefined ? `localhost:${this.port}` : this.hostname},
				basePath: {default: ''},
			})
			.addServer('https://api.zws.im', 'zws.im production')

			.addTag('urls', 'Shortened URLs')
			.addTag('stats', 'Usage statistics')
			.addTag('shields', 'Shields endpoint badges')
			.addTag('health', 'Health checks')
			.build();
	}
}
