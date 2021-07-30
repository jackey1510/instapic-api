// import { validatedUserDto } from './dtos/response/validatedUser.dto';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { refreshTokenProviders } from './refresh-token.provider';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { accessTokenExpireTime } from '../constants';
import { validatedUserDto } from './dtos/response/validatedUser.dto';

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        ...refreshTokenProviders,
      ],
      imports: [
        UsersModule,
        PassportModule,
        DatabaseModule,
        JwtModule.register({
          secret: process.env.ACCESS_TOKEN_SECRET,
          signOptions: { expiresIn: accessTokenExpireTime },
        }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user info', async () => {
      const email = 'abc@email.com';
      const password = 'Abc12345';
      const result: validatedUserDto = {
        bio: 'bio',
        createdAt: new Date(),
        updatedAt: new Date(),
        email,
        username: 'abc',
        id: '39c4af0c-d325-4453-b7dc-88b45d0d67f5',
      };
      jest
        .spyOn(service, 'validateUser')
        .mockImplementation(async () => result);
      expect(await service.validateUser(email, password)).toBe(result);
    });
  });
});
