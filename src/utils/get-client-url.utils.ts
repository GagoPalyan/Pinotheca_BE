import type { ConfigService } from '@nestjs/config';
import { isDev } from 'src/utils/is-dev.utils';

export function getClientUrl(configService: ConfigService) {
  const url = isDev(configService)
    ? configService.getOrThrow<string>('CLIENT_DEV_URL')
    : configService.getOrThrow<string>('CLIENT_PROD_URL');

  return url;
}
