import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { getCorsConfig } from './config/cors.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.enableCors(getCorsConfig(configService));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.get<number>('PORT') ?? 4000);
}
bootstrap();
