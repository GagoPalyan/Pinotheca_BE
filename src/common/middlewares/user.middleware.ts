import { Injectable, NestMiddleware } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import type { Request, Response, NextFunction } from 'express';

import type { IJwtPayload } from '../interfaces';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, _: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      try {
        req.user = this.jwtService.verify<IJwtPayload>(token);
      } catch {
        // invalid token -> guest user
      }
    }

    next();
  }
}
