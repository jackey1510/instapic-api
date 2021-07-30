import { MockRepository } from '../repository/repository.mock';
import { Post } from '../../posts/entities/post.entity';

const postRepository = new MockRepository<Post>();

export const mockPostProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: () => postRepository,
    inject: ['DATABASE_CONNECTION'],
  },
];
