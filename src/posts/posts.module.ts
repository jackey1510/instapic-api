import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { DatabaseModule } from '../database/database.module';
import { postProviders } from './posts.provider';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UtilService } from 'src/util/util.service';

@Module({
  providers: [PostsService, JwtAuthGuard, ...postProviders, UtilService],
  controllers: [PostsController],
  imports: [DatabaseModule],
  exports: [PostsService],
})
export class PostsModule {}
