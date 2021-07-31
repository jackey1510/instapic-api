import { getProfileDto } from './dtos/response/getProfile.dto';
import { MyRequest } from './../types/types';
import { UsersService } from './users.service';
import { createUserDto } from './dtos/request/create-user.dto';

import { Controller, Get, Request, Post, Body } from '@nestjs/common';

import { Public } from '../auth/auth.decorator';
import { ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserDto } from './dtos/response/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('profile')
  @ApiBearerAuth()
  async getProfile(@Request() req: MyRequest): Promise<getProfileDto> {
    return this.userService.getProfile(req.user.username);
  }

  @Public()
  @Post('register')
  @ApiCreatedResponse()
  register(@Body() createUserDto: createUserDto): Promise<UserDto> {
    return this.userService.createOne(createUserDto);
  }
}
