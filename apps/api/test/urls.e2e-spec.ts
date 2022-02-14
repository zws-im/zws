import type {INestApplication} from '@nestjs/common';
import type {TestingModule} from '@nestjs/testing';
import {Test} from '@nestjs/testing';
import request from 'supertest';
import {AppModule} from '../src/app.module';
import type {ShortenedUrlDto} from '../src/urls/dto/shortened-url.dto';

describe('UrlsController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('shortens URLs and redirects you from them', async (): Promise<void> => {
		const shortenUrlResponse = await request(app.getHttpServer()).post('/').send({url: 'https://example.com'}).expect(201);
		const url = shortenUrlResponse.body as ShortenedUrlDto;

		await request(app.getHttpServer())
			.get(`/${encodeURIComponent(url.short)}`)
			.expect(308);
	});
});
