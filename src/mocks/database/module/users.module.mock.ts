import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt.guard';
import { UsersController } from '../../../users/users.controller';
import { UsersService } from '../../../users/users.service';
import { mockUserProviders } from '../provider/users.provider.mock';
import { MockDatabaseModule } from './database.module.mock';

@Module({
  providers: [UsersService, JwtAuthGuard, ...mockUserProviders],
  imports: [MockDatabaseModule],
  exports: [UsersService],
  controllers: [UsersController],
})
export class MockUsersModule {}
