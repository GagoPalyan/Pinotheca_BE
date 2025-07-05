import type { ConfigService } from '@nestjs/config';
import { isDev } from 'src/utils/is-dev.utils';

export function getNodeMailerConfig(configService: ConfigService) {
  return {
    host: 'smtp.gmail.com',
    port: 587,
    secure: !isDev(configService),
    auth: {
      user: configService.getOrThrow<string>('NODEMAILER_USER'),
      pass: configService.getOrThrow<string>('NODEMAILER_PASSWORD'),
    },
  };
}
