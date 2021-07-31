import { mockRefreshToken } from './../data/refreshToken.data.mock';

import { MockRepository } from '../repository/repository.mock';

const mockRefreshTokenRepository = new MockRepository();
mockRefreshTokenRepository.findOne = async (param: { token: string }) => {
  const mockToken = mockRefreshToken();
  if (param.token === mockToken) {
    return mockToken;
  }
  return;
};

export const mockRefreshTokenProviders = [
  {
    provide: 'REFRESH_TOKEN_REPOSITORY',
    useFactory: () => mockRefreshTokenRepository,
    inject: ['DATABASE_CONNECTION'],
  },
];
