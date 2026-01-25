import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailModule } from 'src/common/email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from 'src/config/jwt.config';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { RedisModule } from 'src/services/redis/redis.module';

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
