import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IJwtPayload } from '../interfaces';
import { ROLES_KEY } from '../decorator';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const i18n = I18nContext.current(context);

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as IJwtPayload;

    if (!user || !requiredRoles.includes(user.role))
      throw new ForbiddenException(i18n?.t('backend.auth.forbidden') ?? 'Forbidden');

    return true;
  }
}
