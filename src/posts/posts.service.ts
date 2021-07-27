import { Inject, Injectable } from '@nestjs/common';
import { UtilService } from 'src/util/util.service';
import { Repository } from 'typeorm';
import { createPostDto } from './dtos/request/create-post.dto';
import { getPostsDto } from './dtos/request/get-posts.dto';

import { createPostResponseDto } from './dtos/response/create-post-response.dto';
import { PaginatedPostsDto } from './dtos/response/paginated-posts.dto';
import { Post } from './entities/post.entity';

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
    const fileName = `${userId}/${new Date().getTime().toString()}.${fileType}`;
    const signedUrl = await this.utilService.generateV4UploadSignedUrl(
      fileName,
    );
    const photoUrl = `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${fileName}`;
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
    const { limit, cursor } = getPostDto;
    const realLimit = Math.min(50, limit) + 1;
    let varNo = 2;
    const queryString = `
	  SELECT p."fileName", p.text, u.username FROM POST p INNER JOIN "public"."user" u ON (u.id = p."userId") WHERE p.public = true 
	  ${userId ? ` OR p."userId" = $${varNo++}` : ''}
	  ${cursor ? `WHERE p."createdAt" < $${varNo} ` : ''}
	  order by p."createdAt" DESC limit $1;
	`;
    let values: any[] = [realLimit];

    if (userId) {
      values.push(userId);
    }
    if (cursor) {
      values.push(cursor);
    }

    const posts = await this.postRepository.query(queryString, values);
    return { posts, hasNext: false };
  }
}
