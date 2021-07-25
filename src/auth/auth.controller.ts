import { MyRequest } from './../types/types';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
  Delete,
} from '@nestjs/common';
import { ApiCookieAuth, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { cookieId } from './../constants';
import { Public } from './auth.decorator';
// import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { accessTokenDto } from './dtos/access_token.dto';
import { loginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/login')
  async login(
    @Body() loginDto: loginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<accessTokenDto> {
    const { accessToken, refreshToken } = await this.authService.login(
      loginDto,
    );
    response.cookie('jid', refreshToken);
    return { accessToken };
  }

  @Public()
  @Post('/refresh-token')
  @ApiCookieAuth(cookieId)
  async refreshToken(@Req() request: MyRequest): Promise<accessTokenDto> {
    const cookies = request.cookies;

    if (cookies && cookies[cookieId]) {
      return {
        accessToken: await this.authService.refreshAccessToken(
          cookies[cookieId],
        ),
      };
    }
    throw new BadRequestException({
      field: 'refresh token',
      error: 'not found',
    });
  }

  @Delete('/logout')
  @ApiBearerAuth()
  async logout(
    @Res() response: Response,
    @Req() request: MyRequest,
  ): Promise<void> {
    const cookies = request.cookies;
    console.log(request.user);
    if (cookies && cookies[cookieId]) {
      await this.authService.revokeRefreshToken(
        cookies[cookieId],
        request.user.userId,
      );
      response.clearCookie(cookieId);
    }
    response.status(204).send('true');
    return;
  }
}
