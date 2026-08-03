import { Module } from '@nestjs/common';
import { PrismaModule } from './services/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './services/redis/redis.module';
import { I18nModule } from './services/i18n/i18n.module';
import { ApiModule } from './api/api.module';
import { type MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { UserMiddleware } from './common/middlewares';
import { AuthModule } from './api/auth/auth.module';
import { UserInfoModule } from './socket/user-info/user-info.module';
import { LayoutModule } from './api/layout/layout.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule,
    RedisModule,
    PrismaModule,
    ApiModule,
    AuthModule,
    UserInfoModule,
    LayoutModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes({
      path: 'pictures',
      method: RequestMethod.GET,
    });
  }
}
