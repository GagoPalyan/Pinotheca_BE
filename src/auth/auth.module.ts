import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailModule } from 'src/common/email/email.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'src/redis/redis.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [PrismaModule, RedisModule, ConfigModule, EmailModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
