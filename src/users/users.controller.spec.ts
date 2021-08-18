import { getMockReq } from '@jest-mock/express';
import { MyRequest } from '../types/types';

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { mockUserProviders } from '../mocks/provider/users.provider.mock';
import { MockDatabaseModule } from '../mocks/module/database.module.mock';
import { UserDto } from './dtos/response/user.dto';
import { mockUser1 } from '../mocks/data/users.data.mock';
import { createUserDto } from './dtos/request/create-user.dto';
import { getProfileDto } from './dtos/response/getProfile.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, JwtAuthGuard, ...mockUserProviders],
      imports: [MockDatabaseModule],
      exports: [UsersService],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('returns a user dto', async () => {
      const body: createUserDto = {
        username: 'abcde',
        email: 'abcde@abcde.com',
        password: 'password',
        passwordConfirm: 'passwordConfirm',
        bio: 'bio',
      };
      const result: UserDto = {
        username: body.username,
        email: body.email,
        bio: body.bio!,
      };
      jest.spyOn(service, 'createOne').mockImplementation(async () => result);
      const res = await controller.register(body);
      expect(res).toEqual(result);
    });
  });

  describe('profile', () => {
    it('returns a profile', async () => {
      const mockUser = mockUser1();
      const req: MyRequest = getMockReq();
      req.user = {
        userId: mockUser.id,
        username: mockUser.username,
      };
      const result: getProfileDto = {
        bio: mockUser.bio,
        username: mockUser.username,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      };
      jest.spyOn(service, 'getProfile').mockImplementation(async () => result);
      const res = await controller.getProfile(req);
      expect(res).toEqual(result);
    });
  });
});
