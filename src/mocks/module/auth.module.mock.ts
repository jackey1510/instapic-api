import { mockRefreshTokenProviders } from './../provider/refreshToken.provider.mock';
import { mockAccessTokenSecrect } from './../mock_env';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MockUsersModule } from './users.module.mock';
import { MockDatabaseModule } from './database.module.mock';
import { accessTokenExpireTime } from '../../constants';
import { AuthController } from '../../auth/auth.controller';
import { AuthService } from '../../auth/auth.service';
import { JwtStrategy } from '../../auth/strategies/jwt.strategy';
@Module({
  imports: [
    MockUsersModule,
    PassportModule,
    MockDatabaseModule,
    JwtModule.register({
      secret: mockAccessTokenSecrect,
      signOptions: { expiresIn: accessTokenExpireTime },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ...mockRefreshTokenProviders],
  exports: [AuthService],
})
export class MockAuthModule {}
