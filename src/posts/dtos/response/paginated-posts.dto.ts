import { Post } from 'src/posts/entities/post.entity';

export class PaginatedPostsDto {
  posts: Post[];
  hasNext: boolean;
}
