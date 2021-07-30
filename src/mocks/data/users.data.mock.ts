import { User } from './../../users/entities/users.entity';
import { hash } from 'argon2';

export const mockUser1 = async () => {
  let user = new User();
  user = {
    bio: 'bio',
    createdAt: new Date('2021-07-01'),
    updatedAt: new Date('2021-07-01'),
    email: 'abc@email.com',
    username: 'abc',
    password: await hash(mockUser1PlainPassword),
    id: '39c4af0c-d325-4453-b7dc-88b45d0d67f5',
    refreshTokens: new Promise(() => []),
    posts: new Promise(() => []),
  };
  return user;
};

export const mockUser1PlainPassword = 'Abc12345';
