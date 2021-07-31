import { User } from '../users/entities/users.entity';
import { mockSignedUrl } from './../mocks/provider/util.provider.mock';
import { MockUtilModule } from './../mocks/module/util.module.mock';
import { mockPosts } from './../mocks/data/posts.data.mock';
import { gcp_storage_url } from './../constants';
import { mockUser1 } from '../mocks/data/users.data.mock';
import { getMockReq } from '@jest-mock/express';
import { MyRequest } from '../types/types';
import { mockPostProviders } from './../mocks/provider/posts.provider.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { MockDatabaseModule } from '../mocks/module/database.module.mock';
import { createPostDto } from './dtos/request/create-post.dto';
import { getPostsDto } from './dtos/request/get-posts.dto';
import { createPostResponseDto } from './dtos/response/create-post-response.dto';
import { PaginatedPostsDto } from './dtos/response/paginated-posts.dto';
import { PostDto } from './dtos/response/post.dto';
import { mockBucketName } from '../mocks/mock_env';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;
  let mockUser: User;
  const req: MyRequest = getMockReq();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService, JwtAuthGuard, ...mockPostProviders],
      controllers: [PostsController],
      imports: [MockDatabaseModule, MockUtilModule],
    }).compile();

    mockUser = await mockUser1();
    req.user = {
      userId: mockUser.id,
      username: mockUser.username,
    };

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create post', () => {
    it('should return createPostDto', async () => {
      const fileType = 'png';

      const fileName = `${mockUser.id}/image.${fileType}`;

      const photoUrl = `${gcp_storage_url}/${mockBucketName}/${fileName}`;

      const signedUrl = mockSignedUrl;
      const result: createPostResponseDto = {
        fileName,
        photoUrl,
        signedUrl,
      };
      jest.spyOn(service, 'createPost').mockImplementation(async () => result);
      const body: createPostDto = {
        text: 'hi',
        public: false,
        fileType,
      };
      const res = await controller.createPost(req, body);
      expect(res).toEqual(result);
    });
  });

  describe('get posts', () => {
    it('gets paginated posts', async () => {
      const params: getPostsDto = {
        limit: 9,
      };
      const mockPostList = await mockPosts();

      const posts: PostDto[] = [];

      mockPostList.forEach((p) => {
        const post: PostDto = {
          createdAt: p.createdAt,
          fileName: p.fileName,
          text: p.text,
          updatedAt: p.updatedAt,
          username: mockUser.username,
        };
        posts.push(post);
      });

      const result: PaginatedPostsDto = {
        posts,
        nextCursor: null,
      };

      jest.spyOn(service, 'getPosts').mockImplementation(async () => result);
      const res = await controller.getPosts(req, params);
      expect(res).toEqual(result);
    });
  });
});
