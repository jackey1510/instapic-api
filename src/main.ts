import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv-safe/config';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { cookieId, __prod__ } from './constants';
// import { createConnection } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    },
  });

  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(
    session({
      name: cookieId,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        secure: __prod__,
        sameSite: 'lax',
        // domain: __prod__ ? "" : undefined,
      },
    }),
  );

  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Instapic API')
    .setDescription('The Instapic API description')
    .setVersion('1.0')
    .addBearerAuth({ type: 'apiKey', name: 'Authorization', in: 'header' })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT);
}
bootstrap();
