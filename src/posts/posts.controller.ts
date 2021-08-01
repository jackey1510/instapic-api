import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';

import { Public } from '../auth/auth.decorator';
import { MyRequest } from '../types/types';
import { createPostDto } from './dtos/request/create-post.dto';
import { getPostsDto } from './dtos/request/get-posts.dto';
import { createPostResponseDto } from './dtos/response/create-post-response.dto';
import { PaginatedPostsDto } from './dtos/response/paginated-posts.dto';
import { PostsService } from './posts.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/')
  @ApiBearerAuth()
  async createPost(
    @Req() req: MyRequest,
    @Body() createPostDto: createPostDto,
  ): Promise<createPostResponseDto> {
    const userId = req.user.userId;
    const res = this.postsService.createPost(userId, createPostDto);
    return res;
  }

  @Public()
  @Get('/')
  async getPosts(
    @Req() request: MyRequest,
    @Query() getPostsDto: getPostsDto,
  ): Promise<PaginatedPostsDto> {
    const userId = request.user?.userId;
    return this.postsService.getPosts(getPostsDto, userId);
  }
}
