import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailModule } from 'src/common/email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from 'src/redis/redis.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from 'src/config/jwt.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
    PrismaModule,
    RedisModule,
    ConfigModule,
    EmailModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
