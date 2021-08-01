import { AppService } from './app.service';
import { AppController } from './app.controller';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { PostsModule } from './posts/posts.module';
import { UtilModule } from './util/util.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot(),
    DatabaseModule,
    PostsModule,
    UtilModule,
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
export class AppModule {}
