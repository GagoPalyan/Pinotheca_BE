import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailModule } from '@/common/email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '@/config/jwt.config';
import { PrismaModule } from '@/services/prisma/prisma.module';
import { RedisModule } from '@/services/redis/redis.module';
import { JwtAuthGuard } from '@/common/guard';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
    PassportModule.register({ session: false }),
    PrismaModule,
    RedisModule,
    ConfigModule,
    EmailModule,
  ],
  providers: [AuthService, JwtAuthGuard, GoogleStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
