import { RefreshToken } from './entities/refresh-token.entity';
import { Connection } from 'typeorm';

export const refreshTokenProviders = [
  {
    provide: 'REFRESH_TOKEN_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(RefreshToken),
    inject: ['DATABASE_CONNECTION'],
  },
];
