import { mockPostProviders } from './../mocks/provider/posts.provider.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

import { UtilService } from '../util/util.service';
import { MockDatabaseModule } from '../mocks/module/database.module.mock';

describe('PostsController', () => {
  let controller: PostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        JwtAuthGuard,
        ...mockPostProviders,
        UtilService,
      ],
      controllers: [PostsController],
      imports: [MockDatabaseModule],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
