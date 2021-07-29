import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { postProviders } from './posts.provider';
import { UtilService } from '../util/util.service';
import { PostsController } from './posts.controller';
import { DatabaseModule } from '../database/database.module';

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService, JwtAuthGuard, ...postProviders, UtilService],
      controllers: [PostsController],
      imports: [DatabaseModule],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
