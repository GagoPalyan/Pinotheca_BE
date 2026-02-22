import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IJwtPayload } from '../interfaces';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const i18n = I18nContext.current(context);

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw new UnauthorizedException(i18n?.t('backend.auth.unauthorized') ?? 'Unauthorized');

    const token = authHeader.split(' ')[1];

    try {
      const payload = await this.jwtService.verifyAsync<IJwtPayload>(token);

      request['user'] = payload;

      return true;
    } catch {
      throw new UnauthorizedException(i18n?.t('backend.auth.unauthorized') ?? 'Unauthorized');
    }
  }
}
