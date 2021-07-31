import { UtilModule } from './../util/util.module';
import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { DatabaseModule } from '../database/database.module';
import { postProviders } from './posts.provider';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Module({
  providers: [PostsService, JwtAuthGuard, ...postProviders],
  controllers: [PostsController],
  imports: [DatabaseModule, UtilModule],
  exports: [PostsService],
})
export class PostsModule {}
