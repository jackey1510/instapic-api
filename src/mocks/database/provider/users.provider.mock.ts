import { User } from 'src/users/entities/users.entity';
import { MockRepository } from '../repository/repository.mock';
import { hash } from 'argon2';

const userRepository = new MockRepository<User>();
userRepository.findOne = async () => {
  return {
    username: 'abc',
    email: 'abc@abc.com',
    password: await hash('Abc12345'),
    createdAt: new Date(),
    updatedAt: new Date(),
    bio: '',
    refreshTokens: new Promise(() => {}),
    posts: new Promise(() => {}),
    id: '1',
  };
};

export const mockUserProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: () => userRepository,
    inject: ['DATABASE_CONNECTION'],
  },
];
