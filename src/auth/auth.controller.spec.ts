// import { UsersModule } from './../users/users.module';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
// import { PassportModule } from '@nestjs/passport';
// import { DatabaseModule } from '../database/database.module';
// import { JwtModule } from '@nestjs/jwt';
// import { accessTokenExpireTime } from '../constants';
import { AuthService } from './auth.service';
// import { LocalStrategy } from './strategies/local.strategy';
// import { JwtStrategy } from './strategies/jwt.strategy';
// import { refreshTokenProviders } from './refresh-token.provider';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    // const res: validatedUserDto = {
    //   id: 'ce804ce4-336e-4a9d-93fb-0352f6b1266c',
    //   email: 'abc@email.com',
    //   username: 'abc',
    //   bio: 'hi',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // };
    const ApiServiceProvider = {
      provide: AuthService,
      useFactory: () => ({
        login: jest.fn(() => {
          return { accessToken: 'abc', refreshToken: 'abc' };
        }),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      // imports: [
      //   UsersModule,
      //   PassportModule,
      //   DatabaseModule,
      //   JwtModule.register({
      //     secret: process.env.ACCESS_TOKEN_SECRET,
      //     signOptions: { expiresIn: accessTokenExpireTime },
      //   }),
      // ],

      providers: [AuthService, ApiServiceProvider],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
