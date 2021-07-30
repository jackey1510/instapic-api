import { MockRepository } from '../repository/repository.mock';

export const mockRefreshTokenProviders = [
  {
    provide: 'REFRESH_TOKEN_REPOSITORY',
    useFactory: () => new MockRepository(),
    inject: ['DATABASE_CONNECTION'],
  },
];
