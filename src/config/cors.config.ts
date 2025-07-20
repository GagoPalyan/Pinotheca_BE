import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import type { ConfigService } from '@nestjs/config';
import { getClientUrl } from '../utils/get-client-url.utils';

export function getCorsConfig(configService: ConfigService): CorsOptions {
  const origin = getClientUrl(configService);
  return {
    origin,
    credentials: true,
  };
}
