import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { type Profile, Strategy } from 'passport-google-oauth20';
import type { GoogleProfile } from '@/types/google.types';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: Profile): GoogleProfile {
    const { emails, name, photos } = profile;
    const email = emails?.[0];

    if (!email?.value || !email?.verified) {
      throw new Error('Google account has no verified email address');
    }

    return {
      googleId: profile.id,
      email: email.value,
      firstname: name?.givenName ?? '',
      lastname: name?.familyName ?? '',
      imageUrl: photos?.[0]?.value,
    };
  }
}
