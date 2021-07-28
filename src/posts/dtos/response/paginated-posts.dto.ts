import { PostDto } from './post.dto';

export class PaginatedPostsDto {
  posts: PostDto[];
  nextCursor: Date | null;
}
