import {
  mockAccessTokenSecret,
  mockRefreshTokenSecret,
} from './../mocks/mock_env';
import { mockRefreshToken } from './../mocks/data/refreshToken.data.mock';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { verify, sign, JwtPayload } from 'jsonwebtoken';
import { accessTokenExpireTime } from '../constants';
import { mockUser1 } from '../mocks/data/users.data.mock';
import { MockDatabaseModule } from '../mocks/module/database.module.mock';
import { MockUsersModule } from '../mocks/module/users.module.mock';
import { mockRefreshTokenProviders } from '../mocks/provider/refreshToken.provider.mock';
import { mockUser1PlainPassword } from './../mocks/data/users.data.mock';
import { AuthService } from './auth.service';
import { loginDto } from './dtos/request/login.dto';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtStrategy,
        ConfigService,
        ...mockRefreshTokenProviders,
      ],
      imports: [
        MockUsersModule,
        PassportModule,
        MockDatabaseModule,
        ConfigModule.forRoot({ envFilePath: '.env.test' }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            return {
              secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
              signOptions: { expiresIn: accessTokenExpireTime },
            };
          },
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
      const mockUser = mockUser1();
      const { password, refreshTokens, posts, ...result } = mockUser;
      expect(
        await service.validateUser(mockUser.email, mockUser1PlainPassword),
      ).toEqual(result);
    });
    it('should return null (User not found)', async () => {
      expect(await service.validateUser('bcd', mockUser1PlainPassword)).toEqual(
        null,
      );
    });
    it('should return null (Password incorrect)', async () => {
      const mockUser = mockUser1();
      expect(
        await service.validateUser(mockUser.email, 'wrongPassword'),
      ).toEqual(null);
    });
  });

  describe('login', () => {
    it('returns access token and refresh token', async () => {
      const mockUser = mockUser1();
      const loginDto: loginDto = {
        usernameOrEmail: mockUser.username,
        password: mockUser1PlainPassword,
      };
      const res = await service.login(loginDto);
      expect(res).toBeDefined();
      const expectedPayload = {
        sub: mockUser.id,
        username: mockUser.username,
      };

      // match access token payload

      let payload = verify(
        res.accessToken,
        mockAccessTokenSecret,
      ) as JwtPayload;

      let { sub, username } = payload;

      expect({ sub, username }).toEqual(expectedPayload);

      // match refresh token payload
      let { sub: sub2, username: username2 } = verify(
        res.refreshToken,
        mockRefreshTokenSecret,
      ) as JwtPayload;
      expect({ sub: sub2, username: username2 }).toEqual(expectedPayload);
    });
  });

  it('throws Not found Error', async () => {
    await service
      .login({ usernameOrEmail: 'abcd', password: 'Abc12345' })
      .catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
      });
  });

  it('throws unprocessable entity exception', async () => {
    const mockUser = mockUser1();
    await service
      .login({ usernameOrEmail: mockUser.username, password: '' })
      .catch((err) => {
        expect(err).toBeInstanceOf(UnprocessableEntityException);
      });
  });

  describe('refreshAccessToken', () => {
    it('return a new access token', async () => {
      const mockUser = mockUser1();
      const refreshToken = mockRefreshToken();
      const res = await service.refreshAccessToken(refreshToken);
      expect(verify(res, mockAccessTokenSecret).sub).toEqual(mockUser.id);
      expect(
        (verify(res, mockAccessTokenSecret) as JwtPayload).username,
      ).toEqual(mockUser.username);
    });
    it('return a empty string (refresh token not found)', async () => {
      const res = await service.refreshAccessToken('');
      expect(res).toEqual('');
    });
    it('return a empty string (refresh token not found)', async () => {
      const refreshToken = sign({ username: 'user', sub: 'id' }, 'wrongsecret');
      const res = await service.refreshAccessToken(refreshToken);
      expect(res).toEqual('');
    });
  });

  describe('revokeRefreshToken', () => {
    it('delete refresh token in db', async () => {
      const mockToken = mockRefreshToken();
      await service.revokeRefreshToken(mockToken, 'id').catch((err) => {
        expect(err).toBeUndefined();
      });
    });
  });
});
