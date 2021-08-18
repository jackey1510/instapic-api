import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UtilService } from '../util/util.service';
import { Repository } from 'typeorm';
import { maxPostPerRequest, gcp_storage_url } from './../constants';
import { createPostDto } from './dtos/request/create-post.dto';
import { getPostsDto } from './dtos/request/get-posts.dto';
import { createPostResponseDto } from './dtos/response/create-post-response.dto';
import { PaginatedPostsDto } from './dtos/response/paginated-posts.dto';
import { PostDto } from './dtos/response/post.dto';
import { Post } from './entities/post.entity';
import { config } from 'dotenv-safe';

config();

@Injectable()
export class PostsService {
  constructor(
    @Inject('POST_REPOSITORY')
    private readonly postRepository: Repository<Post>,
    private readonly utilService: UtilService,
  ) {}

  async createPost(
    userId: string,
    createPostDto: createPostDto,
  ): Promise<createPostResponseDto> {
    const { text, public: isPublic, fileType } = createPostDto;
    if (text.length > 300) {
      throw new UnprocessableEntityException([
        {
          field: 'text',
          error: 'Description must be shorter than 300 characters',
        },
      ]);
    }
    const fileName = `${userId}/${new Date().getTime().toString()}.${fileType}`;
    const signedUrl = await this.utilService.generateV4UploadSignedUrl(
      fileName,
    );
    const photoUrl = `${gcp_storage_url}/${process.env.BUCKET_NAME}/${fileName}`;
    await this.postRepository.insert({
      userId,
      fileName,
      photoUrl,
      text,
      public: isPublic,
    });
    return {
      fileName,
      photoUrl,
      signedUrl,
    };
  }

  async getPosts(
    getPostDto: getPostsDto,
    userId?: string,
  ): Promise<PaginatedPostsDto> {
    let { limit, cursor } = getPostDto;
    if (!limit) limit = 9;
    // Real limit is 50, user cannot get more than 50 per request
    const realLimit = Math.min(maxPostPerRequest, limit) + 1;
    let varNo = 2;
    const queryString = `
	  SELECT p."fileName", p.text, u.username, p."createdAt", p."updatedAt" FROM POST p INNER JOIN "public"."user" u ON (u.id = p."userId") WHERE p.public = true 
	  ${userId ? ` OR p."userId" = $${varNo++}` : ''}
	  ${cursor ? `and p."createdAt" < $${varNo} ` : ''}
	  order by p."createdAt" DESC limit $1 ;
	`;
    let values: any[] = [realLimit];

    if (userId) {
      values.push(userId);
    }
    if (cursor) {
      values.push(new Date(cursor));
    }

    const posts: PostDto[] = await this.postRepository.query(
      queryString,
      values,
    );
    let nextCursor: Date | null = null;
    if (posts.length === realLimit) {
      nextCursor = posts[posts.length - 2].createdAt;
    }
    return { posts: posts.slice(0, limit), nextCursor };
  }
}
