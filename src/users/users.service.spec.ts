import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { userProviders } from './users.providers';
import { DatabaseModule } from '../database/database.module';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, JwtAuthGuard, ...userProviders],
      imports: [DatabaseModule],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
