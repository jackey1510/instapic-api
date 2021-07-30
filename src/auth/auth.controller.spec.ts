import { mockUser1 } from './../mocks/data/users.data.mock';
// import { UsersModule } from './../users/users.module';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { accessTokenExpireTime, cookieId } from '../constants';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MockDatabaseModule } from '../mocks/module/database.module.mock';
import { MockUsersModule } from '../mocks/module/users.module.mock';
import { mockRefreshTokenProviders } from '../mocks/provider/refreshToken.provider.mock';
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
      const mockUser = await mockUser1();
      const { password, refreshTokens, posts, ...result } = mockUser;
      jest
        .spyOn(service, 'validateUser')
        .mockImplementation(async () => result);
      const res = await controller.login(
        { usernameOrEmail: mockUser.email, password },
        mockRes,
      );
      expect(res).toBeDefined();
      const payload = verify(res.accessToken, process.env.ACCESS_TOKEN_SECRET);

      expect((payload as JwtUserPayload).username).toEqual(mockUser.username);
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
      const result = await controller.logout(res, req).catch((err) => {
        expect(err).toBeUndefined();
      });
      expect(result).toEqual(true);
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

      expect(res ? res.accessToken : res).toBeDefined();
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
