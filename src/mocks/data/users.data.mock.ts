import { User } from './../../users/entities/users.entity';

export const mockUser1 = () => {
  let user = new User();
  user = {
    bio: 'bio',
    createdAt: new Date('2021-07-01'),
    updatedAt: new Date('2021-07-01'),
    email: 'abc@email.com',
    username: 'abc',
    password:
      '$argon2i$v=19$m=4096,t=3,p=1$BbcFMB53FIQfRPSK4SyWEw$Na4VJK1N/s9aLX19fhqMD+w5gFp2BaoAvMtf8g3ssIQ',
    id: '39c4af0c-d325-4453-b7dc-88b45d0d67f5',
    refreshTokens: new Promise(() => []),
    posts: new Promise(() => []),
    likes: new Promise(() => []),
  };
  return user;
};

export const mockUser1PlainPassword = 'Abc12345';
