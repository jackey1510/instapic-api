import { mockPostsDto } from './../data/posts.data.mock';
import { MockRepository } from '../repository/repository.mock';
import { Post } from '../../posts/entities/post.entity';

const postRepository = new MockRepository<Post>();
postRepository.query = async (_queryString: string, _values?: any[]) => {
  return await mockPostsDto();
};
export const mockPostProviders = [
  {
    provide: 'POST_REPOSITORY',
    useFactory: () => postRepository,
    inject: ['DATABASE_CONNECTION'],
  },
];
