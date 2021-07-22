import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv-safe/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.CORS_ORIGIN,
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Instapic API')
    .setDescription('The Instapic API description')
    .setVersion('1.0')
    .addBearerAuth({ type: 'apiKey', name: 'Authorization', in: 'header' })
    .build();
  // await createConnection({
  //   type: 'postgres',
  //   url: process.env.DATABASE_URL,
  //   logging: true,
  //   synchronize: true,
  // });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT);
}
bootstrap();
