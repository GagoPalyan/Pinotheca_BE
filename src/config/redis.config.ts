import type { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export function getRedisConfig(ConfigService: ConfigService) {
  return new Redis({
    host: ConfigService.getOrThrow<string>('REDIS_HOST'),
    port: ConfigService.getOrThrow<number>('REDIS_PORT'),
  });
}
