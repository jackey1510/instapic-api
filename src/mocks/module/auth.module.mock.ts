import { mockRefreshTokenProviders } from './../provider/refreshToken.provider.mock';
import { mockAccessTokenSecret } from './../mock_env';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MockUsersModule } from './users.module.mock';
import { MockDatabaseModule } from './database.module.mock';
import { accessTokenExpireTime } from '../../constants';
import { AuthController } from '../../auth/auth.controller';
import { AuthService } from '../../auth/auth.service';
import { MockJwtStrategy } from '../strategy/jwt.strategy.mock';
@Module({
  imports: [
    MockUsersModule,
    PassportModule,
    MockDatabaseModule,
    JwtModule.register({
      secret: mockAccessTokenSecret,
      signOptions: { expiresIn: accessTokenExpireTime },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MockJwtStrategy, ...mockRefreshTokenProviders],
  exports: [AuthService],
})
export class MockAuthModule {}
