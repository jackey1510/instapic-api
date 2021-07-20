import { accessTokenDto } from './dtos/access_token.dto';
import { UsersService } from './../users/users.service';
import { loginDto } from './dtos/login.dto';
import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
// import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './auth.decorator';
import { verify } from 'argon2';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userSerivce: UsersService,
  ) {}
  // @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/login')
  async login(@Body() loginDto: loginDto): Promise<accessTokenDto> {
    const user = await this.userSerivce.findOneByUsernameOrEmail(
      loginDto.usernameOrEmail,
    );
    if (!user) throw new NotFoundException('User Not Found');
    if (!verify(user.password, loginDto.password))
      throw new NotFoundException('Password', 'is incorrect');
    return this.authService.login(user);
  }
}
