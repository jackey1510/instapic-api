import { PostDto } from './../../../instapic-web/src/dto/response/post.dto';
import { UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { mockUser1 } from '../mocks/data/users.data.mock';
import { MockDatabaseModule } from '../mocks/module/database.module.mock';
import { User } from '../users/entities/users.entity';
import { gcp_storage_url } from './../constants';
import { mockPostsDto } from './../mocks/data/posts.data.mock';
import { MockUtilModule } from './../mocks/module/util.module.mock';
import { mockPostProviders } from './../mocks/provider/posts.provider.mock';
import { mockSignedUrl } from './../mocks/provider/util.provider.mock';
import { createPostDto } from './dtos/request/create-post.dto';
import { getPostsDto } from './dtos/request/get-posts.dto';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;
  let mockUser: User, userId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService, JwtAuthGuard, ...mockPostProviders],
      imports: [MockDatabaseModule, MockUtilModule],
    }).compile();
    mockUser = mockUser1();
    userId = mockUser.id;

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create post', () => {
    let fileType: string, body: createPostDto;
    beforeAll(async () => {
      fileType = 'png';
      body = {
        text: 'hi',
        public: false,
        fileType,
      };
    });

    it('returns a created post', async () => {
      const res = await service.createPost(userId, body);

      expect(res.fileName).toContain(mockUser.id);
      expect(res.signedUrl).toEqual(mockSignedUrl);
      expect(res.photoUrl).toContain(res.fileName);
      expect(res.photoUrl).toContain(gcp_storage_url);
    });
    it('throws unprocessable untity error(text is too long)', async () => {
      body.text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
      await service.createPost(userId, body).catch((err) => {
        expect(err).toBeInstanceOf(UnprocessableEntityException);
      });
    });
  });

  describe('get posts', () => {
    let mockPostList: PostDto[];
    beforeAll(async () => {
      mockPostList = mockPostsDto();
    });
    const params: getPostsDto = {
      limit: 1,
    };
    it('returns paginated posts', async () => {
      const mockPostList = mockPostsDto();

      let nextCursor = mockPostList[mockPostList.length - 1].createdAt;

      const res = await service.getPosts(params, userId);
      expect(res.nextCursor).toEqual(nextCursor);
      res.posts.forEach((post, index) => {
        expect(post.text).toEqual(mockPostList[index].text);
        expect(post.username).toEqual(mockUser.username);
      });
    });
    it('returns all posts with next cursor = null', async () => {
      const params: getPostsDto = {
        limit: 99,
      };

      const res = await service.getPosts(params, userId);
      expect(res.nextCursor).toEqual(null);
      expect(res.posts.length).toEqual(mockPostList.length);
    });
  });
});
