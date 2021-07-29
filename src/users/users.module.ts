import { JwtAuthGuard } from './../auth/guards/jwt.guard';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../database/database.module';
import { userProviders } from './users.providers';

@Module({
  providers: [UsersService, JwtAuthGuard, ...userProviders],
  imports: [DatabaseModule],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
