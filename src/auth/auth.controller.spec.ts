// import { UsersModule } from './../users/users.module';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { accessTokenExpireTime, cookieId } from '../constants';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { validatedUserDto } from './dtos/response/validatedUser.dto';

import { MockDatabaseModule } from '../mocks/database/module/database.module.mock';
import { MockUsersModule } from '../mocks/database/module/users.module.mock';
import { mockRefreshTokenProviders } from '../mocks/database/provider/refreshToken.provider.mock';
import { getMockRes, getMockReq } from '@jest-mock/express';
import { verify, sign } from 'jsonwebtoken';
import { JwtUserPayload, MyRequest } from '../types/types';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        ...mockRefreshTokenProviders,
      ],
      imports: [
        MockUsersModule,
        PassportModule,
        MockDatabaseModule,
        JwtModule.register({
          secret: process.env.ACCESS_TOKEN_SECRET,
          signOptions: { expiresIn: accessTokenExpireTime },
        }),
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    const mockRes = getMockRes().res;
    it('should return access token', async () => {
      const email = 'abc@email.com';
      const username = 'abc';
      const password = 'Abc12345';
      const result: validatedUserDto = {
        bio: 'bio',
        createdAt: new Date(),
        updatedAt: new Date(),
        email,
        username,
        id: '39c4af0c-d325-4453-b7dc-88b45d0d67f5',
      };
      jest
        .spyOn(service, 'validateUser')
        .mockImplementation(async () => result);
      const res = await controller.login(
        { usernameOrEmail: email, password },
        mockRes,
      );
      expect(res).toBeDefined();
      const payload = verify(res.accessToken, process.env.ACCESS_TOKEN_SECRET);

      expect((payload as JwtUserPayload).username).toEqual(username);
    });
  });

  describe('logout', () => {
    it('return access token', async () => {
      const req: MyRequest = getMockReq();
      req.user = {
        userId: 'abc',
        username: 'abc',
      };

      const res = getMockRes().res;
      await controller.logout(res, req).catch((err) => {
        expect(err).toBeUndefined();
      });
    });
  });

  describe('refreshToken', () => {
    it('return new access token', async () => {
      const req: MyRequest = getMockReq();
      const userId = 'abc';
      const username = 'abc';

      req.cookies[cookieId] = sign(
        { userId, username },
        process.env.REFRESH_TOKEN_SECRET,
      );

      const result = sign(
        { userId, username },
        process.env.ACCESS_TOKEN_SECRET,
      );

      jest
        .spyOn(service, 'refreshAccessToken')
        .mockImplementation(async () => result);

      const res = await controller.refreshToken(req).catch((err) => {
        expect(err).toBeUndefined();
      });

      expect(res!.accessToken).toBeDefined();
      if (res) {
        const payload = verify(
          res.accessToken,
          process.env.ACCESS_TOKEN_SECRET,
        );
        expect((payload as JwtUserPayload).userId).toEqual('abc');
      }
    });
  });
});
