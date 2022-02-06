import { Test, TestingModule } from '@nestjs/testing';
import { GoogleCloudService } from './google-cloud.service';

describe('GoogleCloudService', () => {
  let service: GoogleCloudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleCloudService],
    }).compile();

    service = module.get<GoogleCloudService>(GoogleCloudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
