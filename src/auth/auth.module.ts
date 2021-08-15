import { ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { refreshTokenProviders } from './refresh-token.provider';
import { accessTokenExpireTime } from './../constants';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    DatabaseModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: accessTokenExpireTime },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    ConfigService,
    ...refreshTokenProviders,
  ],
  exports: [AuthService],
})
export class AuthModule {}
