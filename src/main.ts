import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.enableCors({
    credentials: true,
    methods: ['POST', 'GET', 'DELETE', 'PUT', 'UPDATE'],
    allowedHeaders: [
      'Content-Type',
      'Set-Cookie',
      'Origin',
      'Authorization',
      'authorization',
    ],
    exposedHeaders: [
      'Content-Type',
      'Set-Cookie',
      'Access-Control-Allow-Origin',
    ],
    origin: 'http://localhost:3001',
  });
  await app.listen(3000);
}
bootstrap();
