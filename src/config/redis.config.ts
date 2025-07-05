import type { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export function getRedisConfig(configService: ConfigService) {
  return new Redis({
    host: configService.getOrThrow<string>('REDIS_HOST'),
    port: configService.getOrThrow<number>('REDIS_PORT'),
  });
}
