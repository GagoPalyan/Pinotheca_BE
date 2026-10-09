import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getRedisConfig } from '@/config/redis.config';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => getRedisConfig(configService),
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
