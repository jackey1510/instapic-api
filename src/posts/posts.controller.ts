import { Controller, Post } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  @Post('/')
  async createPost() {}
}
