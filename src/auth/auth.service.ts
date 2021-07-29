import { validatedUserDto } from './dtos/response/validatedUser.dto';
import { RefreshToken } from './entities/refresh-token.entity';
import { loginDto } from './dtos/request/login.dto';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import {
  Injectable,
  NotFoundException,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';
import { refreshTokenExpireTime } from '../constants';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject('REFRESH_TOKEN_REPOSITORY')
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async validateUser(
    usernameOrEmail: string,
    password: string,
  ): Promise<null | validatedUserDto> {
    const user = await this.usersService.findOneByUsernameOrEmail(
      usernameOrEmail,
    );
    console.log('user', user);
    if (!user) return null;
    const validPassword = await argon2.verify(user.password, password);
    if (validPassword) {
      const { password, refreshTokens, posts, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: loginDto) {
    const user = await this.usersService.findOneByUsernameOrEmail(
      loginDto.usernameOrEmail,
    );
    if (!user)
      throw new NotFoundException([
        {
          field: 'usernameOrEmail',
          error: 'Username or email not found',
        },
      ]);
    const correctPassword = await argon2.verify(
      user.password,
      loginDto.password,
    );
    if (!correctPassword) {
      throw new UnprocessableEntityException([
        {
          field: 'password',
          error: 'password is incorrect',
        },
      ]);
    }
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: await this.genRefreshToken(payload),
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    const tokenInDB = await this.refreshTokenRepository.findOne({
      token: refreshToken,
    });
    if (!tokenInDB) {
      return '';
    }

    try {
      const payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      if (!payload) {
        return '';
      }
      return this.jwtService.sign({
        username: (payload as userPayload).username,
        sub: payload.sub,
      });
    } catch (err) {
      console.log(err);
      return '';
    }
  }

  private async genRefreshToken(payload: userPayload) {
    const token = sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: refreshTokenExpireTime,
    });
    const exp = new Date();
    exp.setDate(exp.getDate() + 30);
    await this.refreshTokenRepository.insert({
      token,
      userId: payload.sub,
      exp,
    });
    return token;
  }

  async revokeRefreshToken(refreshToken: string, userId: string) {
    return await this.refreshTokenRepository.delete({
      token: refreshToken,
      userId,
    });
  }
}

interface userPayload extends JwtPayload {
  username: string;
}
