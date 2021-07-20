import { getProfileDto } from './dtos/getProfile.dto';
import { MyRequest } from './../types/types';
import { UsersService } from './users.service';
import { createUserDto } from './dtos/create-user.dto';

import {
  Controller,
  //   UseGuards,
  Get,
  Request,
  Post,
  Body,
} from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Public } from 'src/auth/auth.decorator';
import { ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('profile')
  @ApiBearerAuth()
  async getProfile(@Request() req: MyRequest): Promise<getProfileDto> {
    const user = await this.userService.findOneByUsernameOrEmail(
      req.user.username,
    );
    const { password, id, ...values } = user!;
    return values;
  }

  @Public()
  @Post('register')
  @ApiCreatedResponse()
  register(@Body() createUserDto: createUserDto) {
    return this.userService.createOne(createUserDto);
  }
}
