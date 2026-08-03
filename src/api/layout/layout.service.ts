import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { I18nContext } from 'nestjs-i18n';
import { IJwtPayload } from 'src/common/interfaces';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class LayoutService {
  constructor(private readonly PrismaService: PrismaService) {}

  async userInfo(req: Request, i18n: I18nContext) {
    const { id } = req.user as IJwtPayload;

    const user = await this.PrismaService.user.findUnique({
      where: { id },
      select: {
        firstname: true,
        _count: {
          select: {
            likes: true,
            carts: true,
          },
        },
      },
    });

    if (!user) throw new UnauthorizedException(i18n.t('backend.auth.unauthorized'));

    const nameFirstLater = user.firstname[0].toUpperCase();

    return {
      nameFirstLater,
      likes: user._count.likes,
      carts: user._count.carts,
    };
  }
}
