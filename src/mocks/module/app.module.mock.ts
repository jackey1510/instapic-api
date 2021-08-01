import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { AppController } from '../../app.controller';
import { AppService } from '../../app.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { MockDatabaseModule } from './database.module.mock';
import { MockUsersModule } from './users.module.mock';
import { MockUtilModule } from './util.module.mock';
import { MockAuthModule } from './auth.module.mock';
import { MockPostsModule } from './posts.module.mock';

@Module({
  imports: [
    MockAuthModule,
    MockUsersModule,
    ConfigModule.forRoot(),
    MockDatabaseModule,
    MockPostsModule,
    MockUtilModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class MockAppModule {}
