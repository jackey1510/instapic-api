import { Body, Controller, Post, Req } from '@nestjs/common';
import { MyRequest } from 'src/types/types';
import { createPostDto } from './dtos/create-post.dto';
import { postCreatedDto } from './dtos/post-created.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/')
  async createPost(
    @Req() req: MyRequest,
    @Body() createPostDto: createPostDto,
  ): Promise<postCreatedDto> {
    const userId = req.user.userId;
    console.log(createPostDto);
    const res = this.postsService.createPost(userId, createPostDto.text);
    return res;
  }
}
