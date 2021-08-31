import { Like } from './entities/like.entity';
import { Connection } from 'typeorm';
import { Post } from './entities/post.entity';

export const postProviders = [
  {
    provide: 'POST_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Post),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'LIKE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Like),
    inject: ['DATABASE_CONNECTION'],
  },
];
