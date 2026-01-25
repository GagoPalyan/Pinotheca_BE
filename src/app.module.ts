import { Module } from '@nestjs/common';
import { PrismaModule } from './services/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './services/redis/redis.module';
import { I18nModule } from './services/i18n/i18n.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule,
    RedisModule,
    PrismaModule,
    ApiModule,
  ],
})
export class AppModule {}
