import { ConfigService } from '@nestjs/config';

export function getNodeMailerConfig(ConfigService: ConfigService) {
  return {
    user: ConfigService.getOrThrow<string>('NODEMAILER_USER'),
    pass: ConfigService.getOrThrow<string>('NODEMAILER_PASSWORD'),
  };
}
