import {
  mockUtilProviders,
  mockSignedUrl,
} from './../mocks/provider/util.provider.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { UtilService } from './util.service';

describe('UtilService', () => {
  let service: UtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilService, ...mockUtilProviders],
    }).compile();

    service = module.get<UtilService>(UtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateV4UploadSignedUrl', () => {
    it('returns a signedurl', async () => {
      const fileName = 'image.png';
      expect(await service.generateV4UploadSignedUrl(fileName)).toEqual(
        mockSignedUrl,
      );
    });
  });
});
