import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { PostsService } from './../../posts/posts.service';
import { Module } from '@nestjs/common';
import { mockPostProviders } from '../provider/posts.provider.mock';
import { PostsController } from '../../posts/posts.controller';
import { MockDatabaseModule } from './database.module.mock';
import { MockUtilModule } from './util.module.mock';

@Module({
  providers: [PostsService, JwtAuthGuard, ...mockPostProviders],
  controllers: [PostsController],
  imports: [MockDatabaseModule, MockUtilModule],
  exports: [PostsService],
})
export class MockPostsModule {}
