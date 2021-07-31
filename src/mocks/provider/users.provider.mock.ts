import { mockUser1 } from './../data/users.data.mock';
import { User } from '../../users/entities/users.entity';
import { MockRepository } from '../repository/repository.mock';

const userRepository = new MockRepository<User>();
userRepository.findOne = async (params: {
  where: [{ username: string }, { email: string }];
}) => {
  const mockUser = mockUser1();
  if (
    params.where[0].username === mockUser.username ||
    params.where[1].email === mockUser.email
  )
    return mockUser;
  return;
};

export const mockUserProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: () => userRepository,
    inject: ['DATABASE_CONNECTION'],
  },
];
