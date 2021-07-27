import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Public } from 'src/auth/auth.decorator';
import { MyRequest } from 'src/types/types';
import { createPostDto } from './dtos/request/create-post.dto';
import { getPostsDto } from './dtos/request/get-posts.dto';
import { createPostResponseDto } from './dtos/response/create-post-response.dto';
import { PaginatedPostsDto } from './dtos/response/paginated-posts.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/')
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
    @Req() { user }: MyRequest,
    @Body() getPostsDto: getPostsDto,
  ): Promise<PaginatedPostsDto> {
    const userId = user?.userId;
    return this.postsService.getPosts(getPostsDto, userId);
  }
}
