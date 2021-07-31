import { mockUser1 } from '../mocks/data/users.data.mock';
import {
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { MockDatabaseModule } from '../mocks/module/database.module.mock';
import { mockUserProviders } from '../mocks/provider/users.provider.mock';
import { UsersService } from './users.service';
import { UserDto } from './dtos/response/user.dto';
import { createUserDto } from './dtos/request/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, JwtAuthGuard, ...mockUserProviders],
      imports: [MockDatabaseModule],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create one', () => {
    let createUserDto: createUserDto;

    beforeEach(() => {
      createUserDto = {
        username: 'abcde',
        email: 'abcde@email.com',
        password: 'Abc12345',
        passwordConfirm: 'Abc12345',
        bio: 'hi',
      };
    });

    it('creates a new user', async () => {
      const expectedResult: UserDto = {
        username: createUserDto.username,
        email: createUserDto.email,
        bio: createUserDto.bio!,
      };
      const res = await service.createOne(createUserDto);
      expect(res).toEqual(expectedResult);
    });
    it('throws unprocessable entity exception(username taken)', async () => {
      createUserDto.username = 'abc';
      await service.createOne(createUserDto).catch((err) => {
        expect(err).toBeInstanceOf(UnprocessableEntityException);
      });
    });
    it('throw unprocessable entity exception(invalid password)', async () => {
      createUserDto.password = '';
      await service.createOne(createUserDto).catch((err) => {
        expect(err).toBeInstanceOf(UnprocessableEntityException);
      });
    });
    it('throwss unprocessable entity exception(password confirm do not match)', async () => {
      createUserDto.passwordConfirm = '';
      await service.createOne(createUserDto).catch((err) => {
        expect(err).toBeInstanceOf(UnprocessableEntityException);
      });
    });
    it('throws unprocessable entity exception(username is empty)', async () => {
      createUserDto.username = '';
      await service.createOne(createUserDto).catch((err) => {
        expect(err).toBeInstanceOf(UnprocessableEntityException);
      });
    });
    it('throws unprocessable entity exception(email is not valid)', async () => {
      createUserDto.email = 'abcasf';
      await service.createOne(createUserDto).catch((err) => {
        expect(err).toBeInstanceOf(UnprocessableEntityException);
      });
    });
  });
  describe('findOneByUsernameOrEmail', () => {
    const mockUser = mockUser1();
    it('finds a user by username', async () => {
      const res = await service.findOneByUsernameOrEmail(mockUser.username);
      expect(res).toEqual(mockUser);
    });
    it('finds a user by email', async () => {
      const res = await service.findOneByUsernameOrEmail(mockUser.email);
      expect(res).toEqual(mockUser);
    });
    it('returns void (user not exist)', async () => {
      const res = await service.findOneByUsernameOrEmail('notExist');
      expect(res).toBeUndefined;
    });
  });

  describe('getProfile', () => {
    it('returns a user profile', async () => {
      const mockUser = mockUser1();
      const res = await service.getProfile(mockUser.username);
      const { id, password, refreshTokens, posts, ...expected } = mockUser;
      expect(res).toEqual(expected);
    });
    it('throws not found exception', async () => {
      await service.getProfile('notFound').catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
      });
    });
  });
});
